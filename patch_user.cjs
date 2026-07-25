const fs = require('fs');
const p = 'src/context/AppContext.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/const updateUserProfile = \(updatedData: Partial<User>\) => \{\n    if \(!currentUser\) return;\n    const newObj = \{ ...currentUser, ...updatedData \};\n    setCurrentUser\(newObj\);\n    localStorage.setItem\('pc_user', JSON.stringify\(newObj\)\);\n  \};/m, 
`const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const newObj = { ...currentUser, ...updatedData };
    setCurrentUser(newObj);
    localStorage.setItem('pc_user', JSON.stringify(newObj));
    // Optional API call to update user profile in DB could go here
    try {
      await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('pc_jwt_token')
        },
        body: JSON.stringify(updatedData)
      });
    } catch(e) {}
  };`);

fs.writeFileSync(p, c);
