// Built-in Indian food table. Values are per 100 g (or 100 ml) as usually eaten,
// approximated from IFCT 2017 and USDA FoodData Central. Home-style oil included in cooked dishes.
// Row: [name, serving label, serving grams, kcal, protein, carbs, fat, fiber, sugar, satFat,
//       sodium mg, potassium mg, calcium mg, iron mg, magnesium mg, zinc mg, vitC mg, B12 mcg, vitD mcg, search aliases]
window.FOOD_ROWS = [
  // Breads & grains
  ["Roti / chapati (no ghee)", "1 roti", 40, 270, 9, 50, 3.5, 7, 1.5, 0.6, 200, 250, 30, 3, 80, 1.8, 0, 0, 0, "phulka chapati fulka wheat"],
  ["Roti with ghee", "1 roti", 45, 310, 8.5, 46, 9, 6.5, 1.4, 4.5, 190, 230, 28, 2.8, 75, 1.7, 0, 0, 0, "chapati ghee"],
  ["Plain paratha", "1 paratha", 80, 320, 7, 45, 13, 5, 1, 4, 350, 200, 30, 2.5, 60, 1.3, 0, 0, 0, "lachha paratha"],
  ["Aloo paratha", "1 paratha", 120, 290, 6, 40, 12, 4, 1.5, 4, 400, 300, 25, 2, 45, 1, 5, 0, 0, "potato paratha"],
  ["Paneer paratha", "1 paratha", 120, 300, 10, 35, 13.5, 3.5, 1.5, 6, 380, 200, 120, 1.8, 40, 1.2, 1, 0.2, 0, ""],
  ["Steamed white rice", "1 cup", 150, 130, 2.7, 28, 0.3, 0.4, 0.1, 0.1, 1, 35, 10, 0.2, 12, 0.5, 0, 0, 0, "chawal plain rice basmati"],
  ["Brown rice (cooked)", "1 cup", 150, 123, 2.7, 26, 1, 1.6, 0.3, 0.2, 4, 86, 3, 0.6, 39, 0.7, 0, 0, 0, ""],
  ["Jeera rice", "1 cup", 150, 160, 3, 28, 4, 0.6, 0.2, 1.5, 250, 50, 12, 0.4, 14, 0.5, 0, 0, 0, "cumin rice"],
  ["Veg pulao", "1 plate", 200, 150, 3.5, 25, 4, 1.5, 1, 1.2, 300, 120, 20, 0.7, 20, 0.5, 4, 0, 0, "pulav"],
  ["Veg biryani", "1 plate", 250, 160, 4, 24, 5.5, 2, 1.5, 2, 350, 150, 30, 0.8, 22, 0.6, 4, 0, 0, ""],
  ["Chicken biryani", "1 plate", 300, 180, 9, 20, 7, 1, 1, 2.2, 400, 180, 20, 0.9, 20, 1, 2, 0.2, 0.1, ""],
  ["Khichdi (moong dal)", "1 bowl", 250, 120, 4.5, 18, 3.5, 2, 0.5, 1.5, 250, 150, 18, 0.9, 25, 0.6, 1, 0, 0, "khichri"],
  ["Curd rice", "1 bowl", 200, 120, 3.2, 18, 3.8, 0.5, 2, 2, 250, 100, 70, 0.3, 12, 0.5, 0.5, 0.2, 0, "thayir sadam dahi chawal"],
  ["Oats (dry)", "40 g", 40, 380, 13, 67, 6.5, 10, 1, 1.2, 6, 360, 50, 4.3, 140, 3.6, 0, 0, 0, "oatmeal porridge"],
  ["Whole wheat bread", "1 slice", 28, 250, 10, 43, 3.5, 6, 5, 0.7, 450, 250, 150, 2.5, 75, 1.8, 0, 0, 0, "brown bread toast"],
  ["Pav (bread roll)", "1 pav", 40, 280, 8, 52, 4, 2, 5, 1, 500, 110, 60, 2.5, 25, 0.7, 0, 0, 0, "bun"],
  ["Maggi noodles (dry pack)", "1 pack", 70, 440, 8.5, 62, 17, 2, 2, 8, 1600, 150, 20, 2, 20, 0.6, 0, 0, 0, "instant noodles"],

  // South Indian & breakfast
  ["Poha", "1 plate", 200, 150, 3, 25, 4.5, 1.5, 1.5, 0.6, 280, 100, 15, 1.2, 20, 0.5, 5, 0, 0, "flattened rice aval"],
  ["Upma (rava)", "1 plate", 200, 155, 3.5, 22, 6, 1.5, 1.5, 1, 300, 80, 15, 0.8, 15, 0.4, 3, 0, 0, "sooji semolina"],
  ["Idli", "1 idli", 40, 140, 4.5, 29, 0.5, 1.2, 0.3, 0.1, 250, 70, 15, 0.7, 15, 0.5, 0, 0, 0, ""],
  ["Plain dosa", "1 dosa", 80, 190, 4, 28, 7, 1.2, 0.5, 1, 280, 80, 15, 0.8, 18, 0.6, 0, 0, 0, ""],
  ["Masala dosa", "1 dosa", 180, 175, 3.5, 26, 6.5, 2, 1, 1.5, 320, 220, 18, 0.8, 20, 0.5, 6, 0, 0, ""],
  ["Uttapam", "1 uttapam", 120, 170, 4.5, 27, 5, 1.8, 1.5, 0.8, 300, 120, 20, 0.9, 20, 0.5, 6, 0, 0, "uthappam"],
  ["Sambar", "1 bowl", 150, 65, 3, 9, 2, 2.2, 2, 0.3, 300, 180, 25, 1, 22, 0.4, 4, 0, 0, "sambhar"],
  ["Rasam", "1 bowl", 150, 30, 1, 4, 1, 0.8, 1.5, 0.2, 300, 150, 15, 0.4, 10, 0.2, 5, 0, 0, ""],
  ["Coconut chutney", "2 tbsp", 30, 230, 3, 9, 21, 5, 3, 17, 300, 250, 15, 1.2, 30, 0.6, 2, 0, 0, ""],
  ["Moong dal chilla", "1 chilla", 80, 165, 9, 20, 5.5, 3.5, 1, 0.8, 280, 300, 30, 1.7, 50, 1, 4, 0, 0, "cheela pesarattu"],
  ["Besan chilla", "1 chilla", 80, 190, 8.5, 22, 7.5, 4, 2, 1, 300, 330, 35, 2, 55, 1.2, 5, 0, 0, "gram flour cheela"],
  ["Dhokla", "4 pieces", 100, 160, 6, 25, 4, 1.5, 4, 0.6, 450, 160, 35, 1.5, 30, 0.6, 1, 0, 0, "khaman"],

  // Dals & legumes
  ["Dal tadka (toor)", "1 katori", 150, 110, 6, 14, 3.5, 3, 1, 1, 280, 250, 25, 1.4, 35, 0.8, 2, 0, 0, "arhar dal yellow dal"],
  ["Moong dal", "1 katori", 150, 105, 6.5, 14, 2.8, 2.5, 0.8, 0.8, 280, 230, 20, 1.2, 35, 0.7, 1, 0, 0, "yellow moong"],
  ["Masoor dal", "1 katori", 150, 110, 7, 15, 2.8, 3.5, 1, 0.6, 280, 260, 20, 2, 30, 1, 2, 0, 0, "red lentil"],
  ["Dal makhani", "1 katori", 150, 150, 6, 13, 8.5, 4, 1.5, 4.5, 350, 280, 40, 1.8, 40, 1, 1, 0.1, 0, "black dal urad"],
  ["Rajma curry", "1 katori", 150, 120, 6.5, 16, 3.5, 5, 1.5, 0.6, 300, 330, 35, 2, 40, 0.9, 4, 0, 0, "kidney beans"],
  ["Chole / chana masala", "1 katori", 150, 150, 7, 20, 5, 6, 2.5, 0.8, 350, 280, 45, 2.3, 40, 1.3, 4, 0, 0, "chickpea chhole"],
  ["Kadhi pakora", "1 bowl", 200, 110, 3.5, 9, 6.5, 1, 3, 2, 350, 150, 80, 0.8, 15, 0.4, 1, 0.2, 0, "kadi"],
  ["Moong sprouts (steamed)", "1 cup", 100, 105, 7.5, 18, 0.5, 4.5, 2, 0.1, 10, 250, 30, 1.5, 40, 0.9, 8, 0, 0, "sprouts chaat"],
  ["Soya chunks (dry)", "50 g dry", 50, 345, 52, 33, 0.5, 13, 7, 0.1, 20, 2000, 240, 10, 280, 2.5, 0, 0, 0, "nutrela meal maker"],
  ["Soya chunk curry", "1 katori", 150, 120, 13, 9, 4, 3.5, 2, 0.6, 300, 450, 60, 2.5, 60, 0.7, 3, 0, 0, "soya sabzi"],
  ["Tofu (firm)", "100 g", 100, 144, 17, 3, 8.7, 2.3, 0.6, 1.3, 14, 237, 350, 2.7, 58, 1.6, 0, 0, 0, "bean curd"],
  ["Roasted chana", "1 handful", 30, 370, 20, 58, 5.5, 17, 7, 0.6, 25, 850, 60, 5, 130, 3, 0, 0, 0, "bhuna chana gram"],
  ["Peanuts (roasted)", "1 handful", 30, 585, 24, 21, 50, 8, 4, 7, 6, 660, 55, 2.3, 175, 3.3, 0, 0, 0, "moongphali groundnut"],

  // Dairy
  ["Paneer (full fat)", "100 g", 100, 290, 19, 3, 22, 0, 2.5, 14, 20, 130, 400, 0.2, 25, 2.5, 0, 0.6, 0.2, "cottage cheese"],
  ["Paneer (low fat)", "100 g", 100, 200, 24, 5, 9, 0, 3, 5.5, 25, 140, 450, 0.2, 25, 2.8, 0, 0.7, 0.1, "light paneer"],
  ["Paneer bhurji", "1 plate", 150, 220, 13, 6, 16, 1, 2.5, 8, 350, 200, 280, 0.6, 20, 1.5, 8, 0.4, 0.1, ""],
  ["Palak paneer", "1 katori", 200, 145, 7, 6, 10.5, 2, 2, 5, 350, 350, 200, 1.8, 45, 1, 10, 0.3, 0.1, "saag paneer"],
  ["Paneer butter masala", "1 katori", 200, 230, 8, 9, 18, 1.5, 4, 10, 420, 220, 180, 0.8, 20, 1, 5, 0.3, 0.1, "shahi paneer paneer makhani"],
  ["Paneer tikka", "6 pieces", 150, 240, 15, 6, 17.5, 1, 3, 9, 400, 200, 330, 0.6, 25, 1.8, 8, 0.4, 0.1, ""],
  ["Curd / dahi (whole milk)", "1 katori", 150, 62, 3.5, 4.7, 3.3, 0, 4.7, 2.1, 46, 155, 121, 0.05, 12, 0.6, 0.5, 0.37, 0.1, "yogurt"],
  ["Greek yogurt / hung curd (low fat)", "1 cup", 150, 80, 9, 4, 3, 0, 4, 2, 35, 140, 110, 0.05, 11, 0.5, 0, 0.6, 0, "hung curd skyr"],
  ["Raita (cucumber)", "1 katori", 100, 55, 3, 4.5, 3, 0.3, 4, 2, 200, 170, 100, 0.1, 12, 0.5, 1.5, 0.3, 0, ""],
  ["Milk (toned, 3%)", "1 glass", 250, 58, 3.1, 4.7, 3, 0, 4.7, 1.9, 44, 150, 120, 0.03, 11, 0.4, 0, 0.45, 0.3, "doodh"],
  ["Milk (full cream)", "1 glass", 250, 87, 3.2, 4.8, 6, 0, 4.8, 3.8, 45, 150, 120, 0.03, 11, 0.4, 0, 0.4, 0.1, ""],
  ["Buttermilk / chaas", "1 glass", 250, 25, 1.5, 2, 1, 0, 2, 0.6, 150, 70, 55, 0.05, 5, 0.2, 0.3, 0.15, 0, "chhach mattha"],
  ["Sweet lassi", "1 glass", 250, 105, 3, 16, 3, 0, 15, 2, 45, 140, 110, 0.05, 11, 0.5, 0.3, 0.3, 0, ""],
  ["Whey protein", "1 scoop", 32, 390, 78, 8, 6, 0, 5, 3.5, 200, 500, 450, 1, 80, 1.5, 0, 0, 0, "protein powder shake"],
  ["Ghee", "1 tsp", 5, 900, 0, 0, 100, 0, 0, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, "clarified butter"],
  ["Butter", "1 tbsp", 10, 717, 0.9, 0.1, 81, 0, 0.1, 51, 650, 24, 24, 0, 2, 0.1, 0, 0.2, 0, "amul"],
  ["Cooking oil", "1 tbsp", 14, 884, 0, 0, 100, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, "refined mustard sunflower groundnut"],

  // Chicken
  ["Chicken breast (cooked, skinless)", "150 g", 150, 165, 31, 0, 3.6, 0, 0, 1, 74, 256, 15, 1, 29, 1, 0, 0.34, 0.1, "grilled chicken boiled"],
  ["Chicken thigh (cooked, skinless)", "150 g", 150, 210, 26, 0, 11, 0, 0, 3, 90, 240, 12, 1.2, 23, 2.4, 0, 0.4, 0.1, "leg"],
  ["Chicken curry (home style)", "1 katori", 200, 150, 14, 4, 9, 1, 1.5, 2.5, 380, 260, 25, 1, 25, 1.3, 3, 0.25, 0.1, "chicken gravy masala"],
  ["Butter chicken", "1 katori", 200, 210, 14, 6, 14.5, 0.8, 3.5, 7, 450, 250, 50, 0.9, 22, 1.3, 3, 0.3, 0.2, "murgh makhani"],
  ["Chicken tikka", "6 pieces", 150, 160, 25, 3, 5.5, 0.5, 1.5, 1.5, 450, 300, 30, 1.2, 28, 1.2, 2, 0.3, 0.1, ""],
  ["Tandoori chicken (meat only)", "2 pieces", 200, 165, 25, 3, 6, 0.5, 1.5, 1.7, 500, 300, 30, 1.2, 28, 1.8, 2, 0.3, 0.1, ""],
  ["Chicken keema", "1 katori", 150, 180, 18, 4, 10, 1, 1.5, 3, 380, 300, 25, 1.3, 25, 2, 3, 0.3, 0.1, "mince"],

  // Vegetables
  ["Mixed veg sabzi", "1 katori", 150, 90, 2.5, 9, 5, 3, 3, 0.7, 300, 280, 35, 0.8, 20, 0.4, 15, 0, 0, "subzi vegetable"],
  ["Aloo sabzi / jeera aloo", "1 katori", 150, 120, 2, 16, 5.5, 2, 1, 0.8, 300, 380, 12, 0.6, 22, 0.3, 10, 0, 0, "potato"],
  ["Aloo gobi", "1 katori", 150, 95, 2.5, 11, 4.8, 2.8, 2, 0.7, 300, 330, 25, 0.6, 18, 0.3, 30, 0, 0, "cauliflower"],
  ["Bhindi fry", "1 katori", 150, 110, 2.2, 8, 8, 3.5, 1.5, 1, 280, 300, 80, 0.7, 55, 0.6, 18, 0, 0, "okra ladyfinger"],
  ["Baingan bharta", "1 katori", 150, 90, 2, 8, 6, 3.5, 3.5, 0.8, 300, 250, 15, 0.4, 15, 0.2, 5, 0, 0, "brinjal eggplant"],
  ["Palak / spinach sabzi", "1 katori", 150, 70, 3, 5, 4.5, 2.5, 0.6, 0.6, 300, 500, 100, 2.5, 70, 0.5, 15, 0, 0, "saag"],
  ["Green salad", "1 bowl", 100, 20, 0.9, 4, 0.2, 1.3, 2.5, 0, 5, 200, 18, 0.3, 12, 0.2, 12, 0, 0, "cucumber tomato onion kachumber"],

  // Snacks & street food
  ["Samosa", "1 samosa", 80, 260, 4.5, 30, 14, 2.5, 1.5, 3.5, 420, 250, 20, 1.2, 20, 0.4, 5, 0, 0, ""],
  ["Pakora / bhajji", "1 plate", 100, 315, 7, 28, 19, 3.5, 2, 2.5, 450, 280, 35, 2, 40, 0.8, 6, 0, 0, "pakoda bhaji"],
  ["Pav bhaji (plate)", "1 plate", 300, 190, 4.5, 27, 7, 3, 4, 3, 450, 250, 40, 1.3, 22, 0.5, 10, 0, 0, ""],
  ["Bhel puri", "1 plate", 150, 230, 5, 38, 6.5, 3, 6, 1, 500, 200, 20, 2, 30, 0.6, 6, 0, 0, "chaat"],
  ["Veg momos (steamed)", "6 pieces", 150, 170, 5, 28, 4, 2, 1.5, 1, 400, 120, 20, 1, 15, 0.4, 4, 0, 0, "dumplings"],
  ["Chicken momos (steamed)", "6 pieces", 150, 190, 10, 24, 6, 1, 1, 1.8, 420, 150, 20, 1, 18, 0.9, 2, 0.15, 0, "dumplings"],
  ["Makhana (roasted)", "1 bowl", 30, 350, 9.7, 77, 0.1, 7, 0.5, 0, 5, 500, 60, 1.4, 60, 1, 0, 0, 0, "fox nuts lotus seeds"],
  ["Peanut butter", "1 tbsp", 16, 590, 25, 20, 50, 6, 9, 10, 350, 560, 45, 1.9, 170, 2.8, 0, 0, 0, ""],
  ["Almonds", "10 almonds", 12, 579, 21, 22, 50, 12.5, 4.4, 3.8, 1, 733, 269, 3.7, 270, 3.1, 0, 0, 0, "badam"],
  ["Walnuts", "4 halves", 15, 654, 15, 14, 65, 6.7, 2.6, 6, 2, 441, 98, 2.9, 158, 3.1, 1, 0, 0, "akhrot"],
  ["Chia seeds", "1 tbsp", 10, 486, 17, 42, 31, 34, 0, 3.3, 16, 407, 631, 7.7, 335, 4.6, 1.6, 0, 0, ""],
  ["Flax seeds", "1 tbsp", 10, 534, 18, 29, 42, 27, 1.5, 3.7, 30, 813, 255, 5.7, 392, 4.3, 0.6, 0, 0, "alsi"],

  // Fruit
  ["Banana", "1 medium", 110, 89, 1.1, 23, 0.3, 2.6, 12, 0.1, 1, 358, 5, 0.3, 27, 0.15, 8.7, 0, 0, "kela"],
  ["Apple", "1 medium", 180, 52, 0.3, 14, 0.2, 2.4, 10, 0, 1, 107, 6, 0.1, 5, 0, 4.6, 0, 0, "seb"],
  ["Papaya", "1 bowl", 150, 43, 0.5, 11, 0.3, 1.7, 8, 0.1, 8, 182, 20, 0.25, 21, 0.1, 61, 0, 0, "papita"],
  ["Orange", "1 orange", 130, 47, 0.9, 12, 0.1, 2.4, 9, 0, 0, 181, 40, 0.1, 10, 0.1, 53, 0, 0, "santra"],
  ["Guava", "1 guava", 100, 68, 2.6, 14, 1, 5.4, 9, 0.3, 2, 417, 18, 0.3, 22, 0.2, 228, 0, 0, "amrud"],
  ["Mango", "1 cup", 165, 60, 0.8, 15, 0.4, 1.6, 14, 0.1, 1, 168, 11, 0.2, 10, 0.1, 36, 0, 0, "aam"],
  ["Watermelon", "1 bowl", 200, 30, 0.6, 7.6, 0.2, 0.4, 6.2, 0, 1, 112, 7, 0.2, 10, 0.1, 8, 0, 0, "tarbooz"],
  ["Dates", "3 dates", 24, 280, 1.8, 75, 0.2, 7, 66, 0, 2, 696, 64, 0.9, 54, 0.4, 0, 0, 0, "khajoor"],

  // Drinks & sweets
  ["Chai (milk + sugar)", "1 cup", 150, 40, 1.2, 6, 1.2, 0, 6, 0.8, 15, 60, 40, 0.05, 5, 0.15, 0, 0.12, 0, "tea"],
  ["Coffee (milk + sugar)", "1 cup", 150, 45, 1.5, 6.5, 1.5, 0, 6.5, 1, 20, 90, 50, 0.05, 8, 0.2, 0, 0.15, 0, ""],
  ["Black coffee", "1 cup", 200, 2, 0.1, 0, 0, 0, 0, 0, 2, 50, 2, 0, 3, 0, 0, 0, 0, "americano espresso"],
  ["Gulab jamun", "1 piece", 50, 320, 4, 50, 12, 0.5, 40, 6, 80, 80, 70, 0.6, 10, 0.3, 0, 0.1, 0, "mithai sweet"],
  ["Jalebi", "2 pieces", 50, 410, 3, 60, 18, 0.5, 45, 8, 20, 30, 10, 0.8, 8, 0.2, 0, 0, 0, ""],
  ["Kheer", "1 bowl", 150, 140, 3.8, 20, 4.5, 0.2, 14, 2.8, 50, 150, 120, 0.2, 13, 0.4, 0.5, 0.3, 0, "rice pudding payasam"],
];

// Nutrient keys in row order (after name, serving label, serving grams).
window.NUTRIENT_KEYS = ["kcal", "p", "c", "f", "fib", "sug", "sf", "na", "k", "ca", "fe", "mg", "zn", "vc", "b12", "vd"];

window.FOODS = window.FOOD_ROWS.map(function (r, i) {
  var per100 = {};
  window.NUTRIENT_KEYS.forEach(function (k, j) { per100[k] = r[3 + j]; });
  return { id: "b" + i, name: r[0], serving: { label: r[1], g: r[2] }, per100: per100, aliases: r[19] || "", builtin: true };
});
