const { GoogleGenAI } = require('@google/genai');
const { createClient } = require('@supabase/supabase-js');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Initialize Supabase (Use Service Role Key to bypass RLS for server-side insertions)
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'dummy';
const supabase = createClient(supabaseUrl, supabaseKey);

exports.analyzeReport = async (req, res) => {
  try {
    const { problem_id } = req.body;

    if (!problem_id) {
      return res.status(400).json({ error: 'problem_id is required' });
    }

    // 1. Fetch the problem details from Supabase
    const { data: problem, error: fetchError } = await supabase
      .from('problems')
      .select('*')
      .eq('id', problem_id)
      .single();

    if (fetchError || !problem) {
      console.error('Error fetching problem:', fetchError);
      return res.status(404).json({ error: 'Problem not found' });
    }

    // 2. Construct the prompt with edge-case handling instructions
    const prompt = `
      You are an expert civic analyst and startup advisor. Review this community problem report.
      
      Title: "${problem.title}"
      Description: "${problem.description}"
      Category: "${problem.category}"
      Coordinates: "${problem.location}"

      Instructions:
      1. Validation: Determine if this is a genuine civic/community problem. If it is spam, gibberish, a duplicate test, or too short/vague to be actionable, flag it as invalid.
      2. Translation: If the input is in a language other than English, translate your analysis and outputs into English.
      3. Location Check: If the description mentions a city or location that clearly contradicts the coordinates, note this discrepancy in the solution field.
      4. Startup Ideation: Provide a realistic tech or operational startup idea that solves this issue.
    `;

    // 3. Define the strict JSON schema
    const responseSchema = {
      type: "OBJECT",
      properties: {
        is_valid: { type: "BOOLEAN", description: "False if the report is spam, gibberish, test data, or too short to be a real civic problem." },
        reason_if_invalid: { type: "STRING", description: "Explanation if rejected. Empty if valid." },
        severity_score: { type: "INTEGER", description: "Impact score from 1 to 10." },
        priority: { type: "STRING", description: "Must be exactly 'High', 'Medium', or 'Low'." },
        category_prediction: { type: "STRING", description: "Predicted category, e.g., Environment, Transport, Healthcare, Education, Infrastructure." },
        startup_potential: { type: "STRING", description: "A short description of what kind of startup could solve this." },
        solution: { type: "STRING", description: "A short suggested technical or operational solution." }
      },
      required: ["is_valid", "reason_if_invalid", "severity_score", "priority", "category_prediction", "startup_potential", "solution"]
    };

    // 4. Call Gemini API with Structured Outputs
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    // 5. Safely parse the guaranteed JSON
    let aiResult;
    try {
      aiResult = JSON.parse(response.text);
    } catch (parseError) {
      console.error('Failed to parse Gemini output:', response.text);
      return res.status(500).json({ error: 'AI returned invalid format' });
    }

    // 6. Handle Rejections (Spam/Gibberish)
    if (aiResult.is_valid === false) {
      console.log(`Problem ${problem.id} rejected by AI: ${aiResult.reason_if_invalid}`);
      // Update problem status to Rejected
      await supabase.from('problems').update({ status: 'Rejected' }).eq('id', problem.id);
      return res.status(200).json({ 
        success: true, 
        message: 'Report flagged as invalid by AI', 
        reason: aiResult.reason_if_invalid 
      });
    }

    // 7. Insert the valid result into the ai_analysis table
    const { error: insertError } = await supabase
      .from('ai_analysis')
      .insert([
        {
          problem_id: problem.id,
          severity_score: aiResult.severity_score,
          priority: aiResult.priority,
          category_prediction: aiResult.category_prediction,
          startup_potential: aiResult.startup_potential,
          solution: aiResult.solution
        }
      ]);

    if (insertError) {
      console.error('Error saving AI analysis:', insertError);
      return res.status(500).json({ error: 'Failed to save AI analysis to database' });
    }

    // 8. Update the problem status to 'Verified'
    await supabase.from('problems').update({ status: 'Verified' }).eq('id', problem.id);

    return res.status(200).json({ success: true, data: aiResult });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    // If Gemini fails (e.g., rate limit), we catch it here. 
    // The problem remains 'Pending' in the DB so it can be retried later.
    res.status(500).json({ error: 'Internal Server Error during AI Analysis', details: error.message });
  }
};
