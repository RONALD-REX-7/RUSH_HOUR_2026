import csv
import random
import os

CATEGORIES = [
    "Healthcare", "Grocery & Retail", "EV & Transport", "Repair & Maintenance",
    "Education", "Financial Services", "Food & Restaurants", "Utilities",
    "Recreation", "Other"
]

TEMPLATES = {
    "Healthcare": [
        ("No pharmacy in our area", "We have to travel 15km to find the nearest pharmacy. Elderly people face difficulties getting medicines on time."),
        ("Need a local clinic", "There is no doctor available in our neighborhood. We need a primary care clinic for basic medical needs."),
        ("Hospital is too far", "In case of emergency, the nearest hospital is a 45-minute drive. This is dangerous for the community."),
        ("Lack of medical supplies", "The local store doesn't carry basic first aid or medical supplies. A dedicated pharmacy is essential."),
        ("Pediatrician needed", "Many young families here but no pediatrician. We have to take our kids to the city for checkups.")
    ],
    "Grocery & Retail": [
        ("Need a grocery store", "Our neighborhood has no grocery shops. We have to go to the next town for daily essentials."),
        ("Fresh produce market missing", "We don't have anywhere to buy fresh fruits and vegetables locally."),
        ("Supermarket required", "The population has grown but we still rely on a small convenience store. We need a proper supermarket."),
        ("No clothing stores", "There are no retail stores for basic clothing and shoes in this area."),
        ("Lack of household goods", "Nowhere to buy basic household items without driving 20 miles.")
    ],
    "EV & Transport": [
        ("No EV charging stations", "More people are buying electric cars but there are zero public charging stations here."),
        ("Poor bus service", "The bus only comes twice a day. We need more frequent public transport options."),
        ("Train station needed", "A local commuter train stop would greatly reduce traffic on the main highway."),
        ("Road needs repair", "The main road is full of potholes and is dangerous for daily commute."),
        ("Traffic congestion", "We need better traffic management and transit options during rush hour.")
    ],
    "Repair & Maintenance": [
        ("No local mechanic", "If your car breaks down, you have to get it towed far away. We need an auto repair shop."),
        ("Plumber availability", "It is very hard to find a reliable plumber in this area when there is an emergency leak."),
        ("Electrician needed", "We lack certified electricians for home repairs in our community."),
        ("Handyman services missing", "No local services for basic home maintenance and repairs."),
        ("Appliance repair shop", "Nowhere to take broken appliances to get them fixed.")
    ],
    "Education": [
        ("Need a primary school", "Children have to commute an hour to get to the nearest primary school."),
        ("No public library", "Students don't have a quiet place to study or access to library resources."),
        ("Tutoring center needed", "Many high schoolers need extra help but there are no tutoring centers nearby."),
        ("High school is overcrowded", "The current school cannot support the growing population. We need a new high school."),
        ("Adult education classes", "There is a demand for evening classes and adult learning centers here.")
    ],
    "Financial Services": [
        ("No ATM nearby", "We only have one ATM and it is frequently out of order. We need more banking facilities."),
        ("Bank branch closed", "The only local bank branch closed down last year. We need in-person banking services."),
        ("Financial advisor needed", "No local professionals to help with tax preparation or financial planning."),
        ("Insurance broker missing", "Difficult to find local agents to discuss insurance policies face to face."),
        ("Need a credit union", "A local credit union would greatly benefit small businesses in our area.")
    ],
    "Food & Restaurants": [
        ("Lack of dining options", "There are only fast food places here. We need some sit-down restaurants."),
        ("No coffee shop", "A local cafe would be a great gathering place for the community, but we don't have one."),
        ("Healthy food needed", "All the local food places are unhealthy. We need a salad bar or healthy cafe."),
        ("Bakery missing", "Nowhere to buy fresh bread or pastries in the neighborhood."),
        ("Late night food options", "Everything closes by 8 PM. We need some late-night dining options.")
    ],
    "Utilities": [
        ("Frequent power outages", "The electricity grid is unstable and we lose power almost every week."),
        ("Poor internet connection", "The only available ISP is very slow. We need fiber optic internet."),
        ("Water pressure issues", "Many houses in the neighborhood have extremely low water pressure."),
        ("Trash collection unreliable", "Garbage is often left uncollected for days causing hygiene issues."),
        ("No recycling program", "We want to recycle but there is no municipal recycling pickup service.")
    ],
    "Recreation": [
        ("No local park", "Children have nowhere safe to play outdoors. We need a community park."),
        ("Gym facilities missing", "There is no fitness center or gym within a reasonable distance."),
        ("Community center needed", "We need a place for local events, meetings, and indoor recreation."),
        ("Public pool required", "A public swimming pool would be great for the summer months."),
        ("Movie theater", "No local entertainment options like a cinema for families.")
    ],
    "Other": [
        ("General community help", "We need a local support group for various miscellaneous issues."),
        ("Stray animals", "There is a problem with stray dogs and no local animal control facility."),
        ("Noise complaints", "There is no clear process to handle local noise disturbances."),
        ("Need a post office", "The nearest post office is too far for everyday mailing needs."),
        ("Community garden", "It would be nice to have a shared space for a community garden.")
    ]
}

def generate_csv(file_path, num_samples_per_category=55):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['title', 'description', 'category'])
        
        for category in CATEGORIES:
            templates = TEMPLATES.get(category, [("Issue", "Description")])
            for _ in range(num_samples_per_category):
                template = random.choice(templates)
                
                # Add some random variations to make them slightly unique
                prefix_title = random.choice(["", "Urgent: ", "Request: ", "Issue: "])
                suffix_desc = random.choice(["", " Please help.", " This needs attention.", " Very important.", " Thanks."])
                
                title = prefix_title + template[0]
                description = template[1] + suffix_desc
                
                writer.writerow([title, description, category])

if __name__ == "__main__":
    generate_csv(r"c:\PROBLEMCHAIN\RUSH_HOUR_2026\AI\data\training_data.csv")
    print("Generated training data successfully.")
