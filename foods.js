// Built-in Indian food table. Values are per 100 g (or 100 ml) as eaten, i.e. per cooked weight.
// South Indian dishes are computed from standard home recipes (ingredient grams, oil absorbed when fried,
// and the cooked weight) using IFCT 2017 and USDA ingredient values. The rest are approximated from
// IFCT 2017 and USDA FoodData Central, with home-style oil included in cooked dishes. Raw items (chicken, paneer,
// soya chunks, oats) are per 100 g as bought. Protein powders use the brands' label values.
// Row: [name, serving label, serving grams, kcal, protein, carbs, fat, fiber, sugar, satFat,
//       sodium mg, potassium mg, calcium mg, iron mg, magnesium mg, zinc mg, vitC mg, B12 mcg, vitD mcg, search aliases]
window.FOOD_ROWS = [
  // ----- Computed from home recipes by tools/food-recipes.js (edit the recipes, not these rows) -----
  // South Indian tiffin
  ["Idli", "1 idli", 45, 148, 5.02, 30.2, 0.32, 2.15, 0.24, 0.06, 250, 138, 9.73, 0.66, 22.8, 0.7, 0, 0, 0, "idly iddli tiffin"],
  ["Rava idli", "1 rava idli", 50, 173, 5.7, 26.3, 4.85, 1.35, 1.77, 1.28, 403, 125, 46.9, 0.53, 24.5, 0.65, 0.18, 0.12, 0.03, "semolina idli"],
  ["Dosa", "1 dosa", 55, 224, 5.42, 32.6, 7.61, 2.32, 0.26, 1.15, 287, 149, 10.5, 0.71, 24.7, 0.75, 0, 0, 0, "plain dosa dosai sada dosa tiffin"],
  ["Wheat dosa", "1 wheat dosa", 65, 216, 5.2, 33.4, 6.92, 4.55, 0.48, 1.07, 240, 156, 15.8, 1.43, 51.5, 1.08, 0.57, 0, 0, "godhumai dosai godhuma dosa atta dosa"],
  ["Ghee roast dosa", "1 dosa", 90, 237, 4.64, 27.9, 11.4, 1.98, 0.22, 6.94, 220, 127, 8.98, 0.61, 21.1, 0.64, 0, 0, 0, "ghee dosa nei roast"],
  ["Masala dosa", "1 masala dosa", 200, 157, 3.49, 23.8, 5.21, 2.29, 0.94, 0.8, 393, 293, 13.1, 0.74, 23.4, 0.5, 10.6, 0, 0, "masal dosai"],
  ["Onion uttapam", "1 uttapam", 120, 171, 4.28, 26.1, 5.29, 2.15, 1.28, 0.81, 199, 159, 13.3, 0.59, 21.1, 0.6, 2.71, 0, 0, "uthappam uttappam uttapam"],
  ["Rava dosa", "1 rava dosa", 75, 290, 5.35, 41.1, 11.3, 1.81, 0.4, 1.73, 259, 81.7, 9.23, 0.49, 21.7, 0.5, 0.49, 0, 0, "semolina dosa"],
  ["Set dosa", "1 set dosa", 50, 247, 6.27, 44.2, 4.44, 2.64, 0.26, 0.69, 316, 154, 11.5, 0.99, 26.8, 0.89, 0, 0, 0, "sponge dosa"],
  ["Neer dosa", "1 neer dosa", 38, 182, 3.29, 31.7, 4.59, 1.58, 0.37, 2.02, 308, 62.2, 3.69, 0.39, 9.19, 0.53, 0.17, 0, 0, "neer dose"],
  ["Pesarattu", "1 pesarattu", 75, 207, 10.2, 28.5, 5.85, 6.7, 2.93, 0.95, 265, 516, 55, 2.74, 77.5, 1.17, 2.41, 0, 0, "green moong dosa moong dosa"],
  ["Adai", "1 adai", 90, 220, 6.57, 27.3, 9.25, 3.82, 1.51, 2.76, 266, 271, 19.1, 1.24, 36.2, 0.95, 1.08, 0, 0, "adai dosa lentil dosa"],
  ["Ragi dosa", "1 ragi dosa", 70, 233, 3.51, 36, 8.03, 4.46, 0.49, 1.24, 226, 164, 133, 1.71, 57.9, 1.02, 0.53, 0, 0, "finger millet dosa kezhvaragu"],
  ["Appam", "1 appam", 60, 216, 3.73, 37.9, 5.51, 2.37, 4.2, 4.15, 133, 93.4, 4.9, 0.59, 12.2, 0.65, 0.44, 0, 0, "palappam aappam"],
  ["Idiyappam", "3 idiyappam", 120, 146, 2.4, 32, 0.56, 0.96, 0.04, 0.16, 194, 30.4, 4.12, 0.14, 14, 0.32, 0, 0, 0, "string hoppers sevai noolappam"],
  ["Puttu", "1 puttu", 150, 218, 3.33, 41.5, 4.05, 2.1, 0.67, 3.17, 196, 73.6, 6.52, 0.42, 20.7, 0.51, 0.33, 0, 0, "rice puttu puttu kutti"],
  ["Kuzhi paniyaram", "4 pieces", 80, 222, 5.48, 33.4, 7.02, 2.55, 0.96, 1.07, 264, 170, 14.1, 0.73, 25.8, 0.76, 1.23, 0, 0, "paniyaram gunta ponganalu"],
  ["Ven pongal", "1 bowl", 200, 151, 3.9, 19.1, 6.36, 1.25, 0.32, 3.46, 255, 134, 8.7, 0.6, 21.8, 0.57, 0.01, 0, 0, "khara pongal pongal"],
  ["Sweet pongal", "1 bowl", 150, 226, 3.4, 36.4, 7.57, 1.03, 17.3, 4.01, 7.76, 318, 22.8, 1.07, 34.8, 0.58, 0.02, 0, 0, "sakkarai pongal chakkara pongali"],
  ["Rava upma", "1 plate", 200, 145, 3.69, 20.4, 5.33, 1.56, 0.83, 0.8, 295, 95.3, 10.9, 0.43, 16, 0.34, 2.25, 0, 0, "upma uppittu sooji upma"],
  ["Semiya upma", "1 plate", 200, 135, 3.04, 20.4, 4.9, 1.2, 0.97, 0.76, 295, 77.2, 11, 0.46, 12.8, 0.25, 2.24, 0, 0, "vermicelli upma semiya kichadi"],
  ["Poha", "1 plate", 200, 178, 3.68, 25.9, 6.99, 1.98, 1.14, 1, 328, 147, 16.2, 1.63, 24.8, 0.53, 4.5, 0, 0, "aval upma flattened rice avalakki"],
  ["Rava kesari", "1 katori", 100, 331, 3.33, 44.8, 15.3, 0.96, 28, 8.86, 0.83, 60.2, 5.08, 0.47, 18.6, 0.39, 0.01, 0, 0, "kesari bath sheera"],

  // Vadas and fried snacks (oil = what the food absorbs)
  ["Medu vada", "1 vada", 45, 312, 12.9, 28.4, 15.3, 6.51, 1.35, 2.22, 537, 533, 39.2, 2.31, 86, 1.61, 0.49, 0, 0, "vada vadai ulundu vadai uddina vade medhu vada"],
  ["Masala vada", "1 vada", 40, 368, 13.4, 38.6, 18.3, 9.8, 4.18, 2.64, 500, 568, 41.1, 3.18, 83.8, 2.04, 2.48, 0, 0, "vada vadai paruppu vadai dal vada masal vadai aama vadai"],
  ["Sambar vada", "1 vada in sambar", 145, 134, 5.65, 14.1, 5.79, 3.2, 1.6, 0.85, 333, 289, 24.2, 1.18, 38.8, 0.73, 3.11, 0, 0, "vada vadai sambar vadai"],
  ["Thayir vadai", "1 vada in curd", 145, 139, 6.41, 12, 7.01, 2.02, 3.66, 2.14, 305, 272, 95.7, 0.75, 35, 0.91, 0.5, 0.26, 0.07, "vada vadai dahi vada mosaru vade perugu vada curd vada"],
  ["Aloo bonda", "1 bonda", 60, 262, 7.03, 26.6, 14.3, 4.31, 3.61, 2.07, 408, 507, 21.4, 1.78, 57.7, 0.92, 13.8, 0, 0, "potato bonda batata vada"],
  ["Mysore bonda", "1 bonda", 35, 325, 5.41, 33.9, 18.5, 1.16, 1.47, 3.24, 346, 90.2, 41.2, 0.53, 12.9, 0.47, 0.14, 0.11, 0.03, "goli baje"],
  ["Banana bajji", "1 bajji", 35, 322, 8.42, 35.2, 16.8, 5.13, 5.45, 2.44, 467, 547, 17.4, 2.03, 78.1, 1.04, 10.3, 0, 0, "vazhakkai bajji bhaji raw banana bajji"],
  ["Murukku", "2 pieces", 30, 513, 7.57, 58.6, 27, 3.49, 0.34, 6.28, 534, 195, 42.8, 1.21, 53.7, 1.13, 0, 0, 0, "chakli chakkuli thenkuzhal"],
  ["Mixture (South Indian)", "1 handful", 30, 532, 16.7, 39.7, 35.1, 7.93, 5.48, 4.94, 737, 585, 46.9, 3.96, 116, 2.17, 0.18, 0, 0, "madras mixture kara mixture namkeen"],
  ["Banana chips", "1 handful", 30, 492, 1.95, 40.5, 37.5, 3.75, 4.5, 32.3, 394, 675, 4.74, 0.9, 55.5, 0.21, 27, 0, 0, "kerala chips nendran chips"],
  ["Appalam (fried)", "1 appalam", 10, 525, 17.9, 41.9, 32.3, 13, 1.4, 4.85, 1225, 700, 56, 5.32, 175, 2.1, 0, 0, 0, "papad pappadam happala"],

  // Curries and sides
  ["Sambar", "1 katori", 150, 54, 2.4, 7.67, 1.53, 1.71, 1.72, 0.24, 241, 179, 17.4, 0.67, 17.6, 0.34, 4.29, 0, 0, "sambhar kuzhambu"],
  ["Rasam", "1 katori", 150, 21, 0.66, 2.48, 0.95, 0.51, 0.91, 0.52, 234, 61.6, 4.88, 0.26, 6.03, 0.1, 1.52, 0, 0, "saaru charu pepper rasam milagu rasam"],
  ["Beans poriyal", "1 katori", 100, 102, 2.27, 8.31, 7.46, 3.34, 3.44, 3.27, 345, 232, 34.8, 1.16, 27.3, 0.36, 10.7, 0, 0, "beans thoran beans palya poriyal"],
  ["Cabbage poriyal", "1 katori", 100, 101, 1.92, 7.6, 7.71, 3.31, 3.51, 3.41, 371, 205, 39.1, 0.75, 16.7, 0.34, 33, 0, 0, "cabbage thoran muttaikose"],
  ["Keerai poriyal", "1 katori", 100, 78, 4.55, 8.09, 3.59, 2.75, 0.67, 1.23, 283, 571, 89.3, 2.64, 78.4, 0.67, 23.4, 0, 0, "spinach poriyal keerai masiyal thotakura palak"],
  ["Potato roast", "1 katori", 100, 165, 2.41, 19.1, 8.94, 2.79, 0.96, 1.35, 423, 481, 17.4, 1.18, 28.9, 0.39, 21.3, 0, 0, "urulaikizhangu varuval aloo fry potato poriyal"],
  ["Kootu", "1 katori", 150, 86, 3.16, 9.19, 4.24, 2.43, 1.54, 2.5, 295, 210, 18.2, 0.8, 23.4, 0.72, 4.15, 0, 0, "koottu chow chow kootu poricha kootu"],
  ["Avial", "1 katori", 150, 124, 1.9, 10.7, 8.79, 2.91, 3.33, 7.53, 285, 257, 33.8, 0.7, 20.8, 0.47, 10.1, 0.05, 0.01, "aviyal"],
  ["Veg kurma", "1 katori", 150, 107, 1.97, 7.33, 8.34, 2.83, 2.88, 3.63, 295, 222, 25.1, 0.94, 23.4, 0.46, 9.65, 0, 0, "korma vegetable kurma saagu"],
  ["Mor kuzhambu", "1 katori", 150, 63, 2.05, 3.86, 4.68, 0.73, 2.94, 2.74, 218, 116, 64.2, 0.2, 9.61, 0.47, 1.7, 0.19, 0.05, "majjige huli moru curry buttermilk curry"],
  ["Vatha kuzhambu", "1 katori", 100, 76, 0.7, 7.32, 5.23, 1.15, 5.13, 0.74, 624, 106, 14.9, 0.71, 14, 0.13, 1.42, 0, 0, "kara kuzhambu puli kuzhambu vathal kuzhambu"],
  ["Mixed veggies", "1 katori", 120, 66, 1.99, 7.69, 3.34, 3.09, 3.25, 0.51, 331, 274, 38.6, 0.71, 20.2, 0.34, 16.2, 0, 0, "mix veg mixed veg mixed vegetables veg poriyal sabzi subzi stir fry"],
  ["Chana sundal", "1 cup", 100, 200, 8.17, 25.6, 7.92, 7.52, 4.8, 3.27, 351, 289, 44.8, 2.78, 45.3, 1.43, 1.44, 0, 0, "kondakadalai sundal chickpea sundal sundal"],

  // Chutneys
  ["Coconut chutney", "2 tbsp", 30, 192, 3.12, 10.8, 16.2, 4.64, 2.88, 12.3, 475, 210, 10.5, 1.35, 23.2, 0.68, 1.32, 0, 0, "thengai chutney kobbari pachadi white chutney"],
  ["Tomato chutney", "2 tbsp", 30, 111, 1.11, 5.96, 9.72, 1.58, 3.13, 1.46, 461, 224, 16.5, 0.45, 13.1, 0.21, 12.2, 0, 0, "thakkali chutney red chutney"],
  ["Peanut chutney", "2 tbsp", 30, 235, 10.5, 8.09, 19.8, 3.7, 2.8, 2.54, 396, 307, 40.5, 2.05, 71.1, 1.35, 0.17, 0, 0, "kadalai chutney groundnut chutney palli chutney"],
  ["Mint coriander chutney", "2 tbsp", 30, 62, 2.35, 5.89, 3.74, 2.23, 1.12, 3.02, 415, 251, 34.5, 1.3, 33.7, 0.41, 10.7, 0, 0, "green chutney pudina chutney kothamalli chutney"],
  ["Idli podi (dry)", "1 tbsp", 8, 344, 19.7, 48, 9.31, 14.5, 3.83, 1.3, 1966, 975, 166, 5.86, 161, 3.32, 0.45, 0, 0, "gunpowder milagai podi chutney powder podi"],

  // Rice dishes
  ["Lemon rice", "1 plate", 200, 188, 4.06, 27.4, 6.86, 1.03, 0.46, 1.01, 348, 87, 15, 0.49, 21.6, 0.66, 2.32, 0, 0, "elumichai sadam chitranna nimmakaya pulihora"],
  ["Tamarind rice", "1 plate", 200, 201, 3.61, 30.3, 7.37, 1.3, 4.85, 1.05, 433, 129, 19.7, 0.74, 25.4, 0.6, 0.31, 0, 0, "puliyodarai puli sadam pulihora puliyogare"],
  ["Tomato rice", "1 plate", 220, 134, 2.35, 21.9, 4.02, 1.01, 1.36, 0.63, 267, 119, 14.7, 0.38, 14.4, 0.44, 4.92, 0, 0, "thakkali sadam"],
  ["Coconut rice", "1 plate", 200, 194, 3.32, 26.6, 8.34, 1.84, 1.05, 4.67, 322, 103, 11.9, 0.68, 21.3, 0.71, 0.47, 0, 0, "thengai sadam kobbari annam"],
  ["Curd rice", "1 bowl", 250, 105, 3.03, 16.2, 2.99, 0.2, 2.35, 1.25, 214, 93.5, 64.7, 0.12, 11.8, 0.53, 0.21, 0.19, 0.07, "thayir sadam mosaru anna daddojanam perugu annam"],
  ["Bisi bele bath", "1 plate", 250, 116, 3.51, 17.4, 3.51, 2.09, 1.65, 1.73, 300, 186, 18.7, 0.91, 23.8, 0.55, 3.25, 0, 0, "bisibelebath sambar rice sambar sadam"],
  ["South Indian meals (full plate)", "1 plate", 900, 79, 2.36, 12.4, 2.28, 1.33, 1.67, 0.94, 282, 128, 27.7, 0.49, 16, 0.42, 3.38, 0.04, 0.01, "meals saapadu thali oota full meals canteen meals"],

  // Breads
  ["Chapati / roti", "1 chapati", 42, 306, 8.64, 49.3, 8.36, 7.86, 0.29, 1.29, 278, 257, 24.5, 2.57, 89.3, 1.86, 0, 0, 0, "chapathi chappathi phulka fulka wheat roti"],
  ["Parotta", "1 parotta", 85, 340, 6.66, 49.2, 12.4, 1.75, 0.19, 1.86, 366, 69.3, 9.93, 0.78, 14.2, 0.45, 0, 0, 0, "porotta barotta kerala parotta malabar parotta"],
  ["Veg kothu parotta", "1 plate", 250, 179, 3.47, 23.3, 8.06, 2.04, 1.84, 1.21, 372, 153, 19.9, 0.77, 15.9, 0.34, 6.14, 0, 0, "kothu porotta"],
  ["Chicken kothu parotta (no egg)", "1 plate", 250, 204, 8.83, 20.7, 9.46, 1.43, 1.21, 1.66, 367, 188, 15.7, 0.86, 19.1, 0.74, 3.13, 0.1, 0.03, "kothu porotta chicken kothu"],
  ["Poori", "1 poori", 30, 347, 6.05, 34.5, 20.9, 5.5, 0.2, 3.15, 259, 180, 17.2, 1.8, 62.5, 1.3, 0, 0, 0, "puri"],
  ["Poori masala (potato)", "1 katori", 150, 112, 2.01, 14.5, 5.22, 2.01, 1.41, 0.79, 394, 336, 13, 0.69, 20.9, 0.29, 14.9, 0, 0, "potato masala aloo masala poori kizhangu"],
  ["Ragi mudde", "1 ball", 150, 107, 2.4, 22.3, 0.63, 3.73, 0.17, 0.1, 81.2, 133, 121, 1.53, 48.7, 0.83, 0, 0, 0, "ragi ball ragi kali kali finger millet ball"],
  ["Ragi malt", "1 glass", 250, 87, 2.89, 13.4, 2.4, 0.84, 7.81, 1.45, 35.3, 195, 121, 0.5, 22.7, 0.5, 0, 0.34, 0.23, "ragi porridge ragi java ragi koozh"],

  // Chicken
  ["Chicken curry (South Indian)", "1 katori", 150, 142, 11.7, 3.33, 9.23, 1.15, 1.35, 2.94, 389, 253, 15.2, 0.87, 21.5, 1.04, 3.1, 0.19, 0.06, "chettinad chicken kozhi kuzhambu chicken kulambu chicken gravy chicken masala"],
  ["Chicken 65", "1 plate", 150, 295, 22.5, 10.1, 18.2, 0.61, 0.12, 3.63, 589, 357, 17.4, 1.28, 32.7, 1.84, 0.22, 0.38, 0.11, "chicken sixty five"],
  ["Pepper chicken", "1 katori", 150, 234, 23.2, 2.84, 14.4, 0.75, 1.05, 3.1, 616, 396, 21.7, 1.23, 34.3, 1.91, 1.86, 0.4, 0.11, "chicken pepper fry milagu kozhi chicken sukka"],

  // Sweets
  ["Kozhukattai (sweet)", "1 piece", 40, 232, 2.35, 41, 6.71, 2.07, 13.7, 5.35, 7.5, 234, 17.1, 0.86, 25.8, 0.44, 0.49, 0, 0, "modak kozhukatta kudumu"],
  ["Semiya payasam", "1 bowl", 150, 167, 3.8, 20.4, 7.8, 0.31, 14, 4.46, 36.7, 145, 98.4, 0.28, 17.8, 0.5, 0.01, 0.32, 0.08, "vermicelli kheer payasam"],
  ["Mysore pak", "1 piece", 30, 597, 5.6, 64.5, 35, 2.7, 52.7, 20.8, 16.5, 213, 11.8, 1.25, 41.5, 0.7, 0, 0, 0, "mysorepak"],
  ["Boondi laddu", "1 laddu", 40, 472, 7.27, 63.2, 21.3, 3.34, 48.4, 4.55, 20, 275, 15.1, 1.69, 58.6, 1.01, 0.02, 0, 0, "ladoo laddoo"],

  // Coffee, tea and coconut water
  ["Coffee (milk + sugar)", "1 tumbler", 150, 67, 2.5, 8.76, 2.4, 0, 8.76, 1.52, 35.7, 130, 96.5, 0.03, 9.4, 0.32, 0, 0.36, 0.24, "filter coffee kaapi filter kaapi"],
  ["Coffee (milk, no sugar)", "1 tumbler", 150, 47, 2.5, 3.76, 2.4, 0, 3.76, 1.52, 35.6, 130, 96.4, 0.03, 9.4, 0.32, 0, 0.36, 0.24, "filter coffee kaapi without sugar sugar free unsweetened"],
  ["Tea (milk + sugar)", "1 cup", 150, 50, 1.55, 7.5, 1.5, 0, 7.35, 0.95, 23.6, 93.6, 60.1, 0.03, 7, 0.21, 0, 0.23, 0.15, "chai masala chai teh"],
  ["Tea (milk, no sugar)", "1 cup", 150, 30, 1.55, 2.5, 1.5, 0, 2.35, 0.95, 23.5, 93.5, 60, 0.03, 7, 0.21, 0, 0.23, 0.15, "chai without sugar sugar free unsweetened"],
  ["Tender coconut water", "1 coconut", 250, 19, 0.7, 3.7, 0.2, 1.1, 2.6, 0.18, 105, 250, 24, 0.3, 25, 0.1, 2.4, 0, 0, "elaneer ilaneer nariyal pani coconut water"],

  // Oats
  ["Overnight oats (oats, milk, chia)", "1 jar", 195, 135, 5.52, 18.6, 4.43, 2.95, 3.82, 1.77, 35.5, 200, 119, 1.09, 45.4, 1.16, 0.04, 0.35, 0.23, "overnight oats jar"],
  ["Oats porridge (milk)", "1 bowl", 260, 103, 4.42, 14, 3.31, 1.55, 3.77, 1.63, 34.8, 171, 100, 0.68, 29.7, 0.86, 0, 0.35, 0.23, "oatmeal oats kanji oats with milk"],

  // Nut and seed mixes
  ["Mixed nuts", "1 handful", 30, 587, 18.7, 23.2, 51.1, 8.28, 5.15, 5.9, 4, 715, 127, 4.3, 210, 3.55, 1.85, 0, 0, "dry fruits nuts mix"],
  ["Mixed seeds", "1 tbsp", 10, 541, 21.5, 25.4, 43.3, 19.1, 1.4, 5.05, 15.5, 669, 253, 6.86, 411, 5.43, 1.38, 0, 0, "seeds mix seed mix"],
  ["Mixed nuts & seeds", "1 handful", 30, 564, 20.1, 24.3, 47.2, 13.7, 3.28, 5.48, 9.75, 692, 190, 5.58, 311, 4.49, 1.61, 0, 0, "trail mix nuts and seeds mix"],

  // Fast food and chips
  ["Pizza (veg)", "1 slice (medium)", 80, 235, 8.47, 30.3, 8.71, 1.51, 2.04, 3.26, 442, 117, 112, 0.63, 15.8, 0.88, 3.78, 0.24, 0.06, "margherita veg pizza cheese pizza dominos pizza hut"],
  ["Pizza (chicken)", "1 slice (medium)", 80, 250, 11.1, 29.8, 9.31, 1.34, 1.84, 3.29, 478, 149, 101, 0.72, 18.3, 1.06, 2.88, 0.27, 0.07, "chicken pizza dominos pizza hut"],
  ["Veg burger (aloo tikki)", "1 burger", 145, 245, 5.09, 33.7, 10.1, 2.14, 4.44, 1.85, 469, 228, 36.2, 1.46, 21.9, 0.48, 8.7, 0, 0, "burger mcaloo tikki veg burger"],
  ["Chicken burger", "1 burger", 155, 282, 12, 27.5, 13.8, 1.31, 3.89, 2.71, 527, 199, 33.9, 1.44, 23.3, 0.98, 1.94, 0.14, 0.04, "burger mcchicken crispy chicken burger"],
  ["French fries", "1 medium", 110, 294, 4.2, 35.7, 15.2, 4.62, 1.68, 2.31, 400, 893, 25.4, 1.68, 48.3, 0.63, 41.4, 0, 0, "fries finger chips"],
  ["Potato chips", "1 small pack", 26, 540, 6, 51, 35.3, 6.6, 2.4, 11.3, 599, 1275, 36.4, 2.4, 69, 0.9, 59.1, 0, 0, "chips lays crisps wafers potato wafers"],
  ["Kurkure (masala)", "1 small pack", 30, 542, 4.95, 48.9, 36.3, 2.84, 2.64, 17.2, 724, 169, 15.5, 1.31, 37.7, 0.69, 0.31, 0, 0, "corn puffs namkeen chips"],
  ["Tapioca chips", "1 handful", 30, 549, 2.3, 61.2, 33.5, 2.98, 2.75, 28.8, 488, 440, 26.9, 0.51, 34.6, 0.56, 33, 0, 0, "kappa chips maravalli kizhangu chips cassava chips"],

  // Air fryer
  ["French fries (air fryer)", "1 bowl", 100, 154, 3.3, 28.1, 3.17, 3.63, 1.32, 0.5, 320, 701, 20, 1.32, 38, 0.5, 32.5, 0, 0, "airfryer fries air fried fries chips"],
  ["Chicken 65 (air fryer)", "1 plate", 150, 214, 23.9, 5.6, 10.5, 0.51, 0.55, 2.67, 634, 391, 29.1, 1.31, 35, 1.99, 0.28, 0.44, 0.13, "airfryer chicken 65 air fried chicken"],
  ["Tandoori chicken breast (air fryer)", "150 g", 150, 175, 26.6, 1.92, 6.1, 0.47, 0.99, 1.38, 503, 480, 31.5, 0.78, 38.8, 0.95, 1.42, 0.3, 0.13, "airfryer chicken breast air fried chicken breast tandoori breast"],
  ["Paneer tikka (air fryer)", "6 pieces", 150, 258, 15.3, 6.87, 18.6, 1.14, 3.82, 10.8, 310, 208, 321, 0.58, 29.9, 2.07, 3.48, 0.49, 0.16, "airfryer paneer air fried paneer"],
  ["Soya chunks fry (air fryer)", "1 plate (50 g dry)", 125, 208, 21.8, 18.9, 5.12, 5.88, 3.71, 1.02, 482, 863, 122, 4.51, 120, 1.2, 0.4, 0.06, 0.02, "airfryer soya meal maker fry soya 65 nutrela"],
  ["Crispy chickpeas (air fryer)", "1 small bowl", 40, 315, 15, 46.3, 8.7, 13, 8.08, 1.1, 497, 505, 85.3, 5.09, 83.3, 2.55, 2.33, 0, 0, "airfryer chana roasted chickpeas kondakadalai"],
  ["Veg cutlet (air fryer)", "2 cutlets", 100, 126, 3.08, 21, 3.36, 2.91, 1.76, 0.51, 326, 378, 24.9, 0.99, 25.2, 0.4, 17.9, 0, 0, "airfryer cutlet veg tikki"],
  // ----- End of computed rows -----

  // Breads & grains
  ["Plain paratha", "1 paratha", 80, 320, 7, 45, 13, 5, 1, 4, 350, 200, 30, 2.5, 60, 1.3, 0, 0, 0, "lachha paratha"],
  ["Aloo paratha", "1 paratha", 120, 290, 6, 40, 12, 4, 1.5, 4, 400, 300, 25, 2, 45, 1, 5, 0, 0, "potato paratha"],
  ["Paneer paratha", "1 paratha", 120, 300, 10, 35, 13.5, 3.5, 1.5, 6, 380, 200, 120, 1.8, 40, 1.2, 1, 0.2, 0, ""],
  ["Rice (cooked)", "1 cup", 150, 130, 2.7, 28, 0.3, 0.4, 0.1, 0.1, 1, 35, 10, 0.2, 12, 0.5, 0, 0, 0, "cooked rice steamed rice white rice plain rice boiled rice chawal basmati sadam saadam annam choru ponni sona masoori"],
  ["Brown rice (cooked)", "1 cup", 150, 123, 2.7, 26, 1, 1.6, 0.3, 0.2, 4, 86, 3, 0.6, 39, 0.7, 0, 0, 0, ""],
  ["Jeera rice", "1 cup", 150, 160, 3, 28, 4, 0.6, 0.2, 1.5, 250, 50, 12, 0.4, 14, 0.5, 0, 0, 0, "cumin rice"],
  ["Veg pulao", "1 plate", 200, 150, 3.5, 25, 4, 1.5, 1, 1.2, 300, 120, 20, 0.7, 20, 0.5, 4, 0, 0, "pulav"],
  ["Veg biryani", "1 plate", 250, 160, 4, 24, 5.5, 2, 1.5, 2, 350, 150, 30, 0.8, 22, 0.6, 4, 0, 0, ""],
  ["Chicken biryani", "1 plate", 300, 180, 9, 20, 7, 1, 1, 2.2, 400, 180, 20, 0.9, 20, 1, 2, 0.2, 0.1, "dindigul ambur seeraga samba"],
  ["Khichdi (moong dal)", "1 bowl", 250, 120, 4.5, 18, 3.5, 2, 0.5, 1.5, 250, 150, 18, 0.9, 25, 0.6, 1, 0, 0, "khichri"],
  ["Oats (raw)", "40 g", 40, 379, 13.2, 67.7, 6.5, 10.1, 1, 1.1, 6, 362, 52, 4.25, 138, 3.6, 0, 0, 0, "dry rolled oats oatmeal quaker saffola"],
  ["Kellogg's Corn Flakes", "1 bowl (dry, no milk)", 30, 380, 6.67, 87, 1, 2.67, 8.33, 0.67, 500, 0, 0, 0, 0, 0, 0, 0, 0, "kelloggs kellogs cornflakes corn flakes breakfast cereal original"],
  ["Whole wheat bread", "1 slice", 28, 250, 10, 43, 3.5, 6, 5, 0.7, 450, 250, 150, 2.5, 75, 1.8, 0, 0, 0, "brown bread toast"],
  ["Bun / pav (small)", "1 bun", 35, 290, 8.5, 54, 4.5, 2, 8, 1.5, 450, 110, 60, 2.5, 25, 0.7, 0, 0, 0, "bread roll burger bun bakery bun small bun"],
  // iD Fresh ready parotas, from the pack label (a 350 g pack has 5, so about 70 g each), as packed, before any oil on the pan
  ["iD Malabar Parota", "1 parota", 70, 335, 9.6, 42.5, 14, 0, 0, 0, 250, 0, 0, 0, 0, 0, 0, 0, 0, "id fresh idfresh malabar parotta paratha kerala parota porotta barotta ready frozen"],
  ["iD Whole Wheat Parota", "1 parota", 70, 312.9, 11.52, 30.81, 15.95, 0, 0, 0, 300, 0, 0, 0, 0, 0, 0, 0, 0, "id fresh idfresh wheat parotta paratha atta parota porotta ready frozen"],
  ["Maggi noodles (dry pack)", "1 pack", 70, 440, 8.5, 62, 17, 2, 2, 8, 1600, 150, 20, 2, 20, 0.6, 0, 0, 0, "instant noodles"],

  // Breakfast
  ["Moong dal chilla", "1 chilla", 80, 165, 9, 20, 5.5, 3.5, 1, 0.8, 280, 300, 30, 1.7, 50, 1, 4, 0, 0, "cheela"],
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
  ["Soya chunks (raw)", "50 g dry", 50, 345, 52, 33, 0.5, 13, 7, 0.1, 20, 2000, 240, 10, 280, 2.5, 0, 0, 0, "dry nutrela meal maker soya chunks"],
  ["Soya chunk curry", "1 katori", 150, 120, 13, 9, 4, 3.5, 2, 0.6, 300, 450, 60, 2.5, 60, 0.7, 3, 0, 0, "soya sabzi"],
  ["Tofu (firm)", "100 g", 100, 144, 17, 3, 8.7, 2.3, 0.6, 1.3, 14, 237, 350, 2.7, 58, 1.6, 0, 0, 0, "bean curd"],
  ["Roasted chana", "1 handful", 30, 370, 20, 58, 5.5, 17, 7, 0.6, 25, 850, 60, 5, 130, 3, 0, 0, 0, "bhuna chana gram"],
  ["Peanuts (roasted)", "1 handful", 30, 585, 24, 21, 50, 8, 4, 7, 6, 660, 55, 2.3, 175, 3.3, 0, 0, 0, "moongphali groundnut kadalai verkadalai raw peanuts"],

  // Dairy
  ["Paneer (raw)", "100 g", 100, 290, 19, 3, 22, 0, 2.5, 14, 20, 130, 400, 0.2, 25, 2.5, 0, 0.6, 0.2, "cottage cheese full fat malai paneer"],
  ["Paneer bhurji", "1 plate", 150, 220, 13, 6, 16, 1, 2.5, 8, 350, 200, 280, 0.6, 20, 1.5, 8, 0.4, 0.1, ""],
  ["Palak paneer", "1 katori", 200, 145, 7, 6, 10.5, 2, 2, 5, 350, 350, 200, 1.8, 45, 1, 10, 0.3, 0.1, "saag paneer"],
  ["Paneer butter masala", "1 katori", 200, 230, 8, 9, 18, 1.5, 4, 10, 420, 220, 180, 0.8, 20, 1, 5, 0.3, 0.1, "shahi paneer paneer makhani"],
  ["Paneer tikka", "6 pieces", 150, 240, 15, 6, 17.5, 1, 3, 9, 400, 200, 330, 0.6, 25, 1.8, 8, 0.4, 0.1, ""],
  ["Curd / dahi (whole milk)", "1 katori", 150, 62, 3.5, 4.7, 3.3, 0, 4.7, 2.1, 46, 155, 121, 0.05, 12, 0.6, 0.5, 0.37, 0.1, "yogurt thayir mosaru perugu"],
  ["Greek yogurt (plain)", "100 g", 100, 73, 9.95, 3.94, 1.92, 0, 3.56, 1.23, 34, 141, 115, 0.04, 11, 0.52, 0, 0.75, 0, "hung curd skyr greek yoghurt epigamia"],
  ["Milky Mist fruit yogurt", "1 cup", 100, 104, 3.6, 15.3, 3.1, 0, 15.3, 1.3, 21, 0, 109, 0, 0, 0, 0, 0, 0, "milkymist flavoured yogurt flavored yogurt fruit yoghurt strawberry mango blueberry"],
  ["Raita (cucumber)", "1 katori", 100, 55, 3, 4.5, 3, 0.3, 4, 2, 200, 170, 100, 0.1, 12, 0.5, 1.5, 0.3, 0, ""],
  ["Milk (toned, 3%)", "1 glass", 250, 58, 3.1, 4.7, 3, 0, 4.7, 1.9, 44, 150, 120, 0.03, 11, 0.4, 0, 0.45, 0.3, "doodh"],
  ["Milk (full cream)", "1 glass", 250, 87, 3.2, 4.8, 6, 0, 4.8, 3.8, 45, 150, 120, 0.03, 11, 0.4, 0, 0.4, 0.1, ""],
  ["Buttermilk / chaas", "1 glass", 250, 25, 1.5, 2, 1, 0, 2, 0.6, 150, 70, 55, 0.05, 5, 0.2, 0.3, 0.15, 0, "chhach mattha neer mor moru majjige"],
  ["Sweet lassi", "1 glass", 250, 105, 3, 16, 3, 0, 15, 2, 45, 140, 110, 0.05, 11, 0.5, 0.3, 0.3, 0, ""],
  ["Yakult", "1 bottle", 65, 66, 1.3, 15.4, 0, 0, 13.6, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, "probiotic drink"],
  ["Yakult Light", "1 bottle", 65, 38, 1.2, 8, 0, 3, 4.6, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, "yakult lite probiotic drink low sugar"],
  ["Whey protein", "1 scoop", 32, 390, 78, 8, 6, 0, 5, 3.5, 200, 500, 450, 1, 80, 1.5, 0, 0, 0, "protein powder shake"],
  ["Ghee", "1 tsp", 5, 900, 0, 0, 100, 0, 0, 62, 0, 0, 0, 0, 0, 0, 0, 0, 0, "clarified butter"],
  ["Butter", "1 tbsp", 10, 717, 0.9, 0.1, 81, 0, 0.1, 51, 650, 24, 24, 0, 2, 0.1, 0, 0.2, 0, "amul"],
  ["Cooking oil", "1 tbsp", 14, 884, 0, 0, 100, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, "refined mustard sunflower groundnut"],

  // Plant and yeast protein powders (per 100 g of powder, from the brands' label listings)
  ["Yogabar Plant Protein (unflavoured)", "1 scoop", 35, 406, 80, 0.6, 9.7, 0, 0.3, 2, 1000, 100, 100, 20, 50, 4, 0, 0, 0, "yoga bar yogabar plant protein pea protein vegan protein powder"],
  ["Yogabar Yeast Protein (unflavoured)", "1 scoop", 38, 392, 81, 5.5, 5, 0, 0.5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, "yoga bar yogabar yeast protein fermented protein powder vegan"],
  ["GNC AMP Plant Isolate (chocolate hazelnut)", "1 scoop", 34.5, 352, 72.5, 8.7, 2.9, 1, 1, 0.5, 1000, 150, 100, 18, 60, 3.5, 0, 0, 0, "gnc plant protein pea protein vegan protein powder"],
  ["GNC Select Yeast Protein", "1 scoop", 35, 398, 71, 14, 6.4, 0, 1, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, "gnc yeast protein fermented protein powder vegan"],
  ["SuperYou Pro Yeast Protein (unflavoured)", "1 scoop", 33, 406, 81.8, 6.7, 5.8, 0, 0.5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, "superyou super you yeast protein fermented protein powder vegan"],
  ["SuperYou Pro Yeast Protein (flavoured)", "1 scoop", 36, 375, 66.7, 16.7, 4.4, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, "superyou super you yeast protein fermented protein powder vegan chocolate vanilla coffee"],

  // Protein bars and wafers (per 100 g, from label listings; Mega wafer and Yogabar wafer carbs and fat estimated)
  ["SuperYou Protein Wafer Mini (5 g protein)", "1 mini", 20, 465, 25, 51, 25.9, 7.6, 8.9, 17.5, 443, 0, 0, 0, 0, 0, 0, 0, 0, "superyou super you protein bar wafer bar 5g mini"],
  ["SuperYou Protein Wafer (10 g protein)", "1 wafer", 40, 465, 25, 51, 25.9, 7.6, 8.9, 17.5, 443, 0, 0, 0, 0, 0, 0, 0, 0, "superyou super you protein bar wafer bar 10g"],
  ["SuperYou Mega Protein Wafer (20 g protein)", "1 wafer", 60, 468, 33.3, 37, 22.5, 8, 6, 15, 400, 0, 0, 0, 0, 0, 0, 0, 0, "superyou super you protein bar wafer bar 20g mega"],
  ["Yogabar 20g Protein Bar", "1 bar", 70, 461, 29.1, 35.6, 22.6, 14.3, 3, 7, 359, 0, 0, 0, 0, 0, 0, 0, 0, "yoga bar yogabar protein bar 20g whey almond fudge chocolate brownie"],
  ["Yogabar Protein Wafer (10 g protein)", "1 wafer", 40, 468, 25, 51, 26, 7.5, 9, 17, 400, 0, 0, 0, 0, 0, 0, 0, 0, "yoga bar yogabar protein wafer wafer bar 10g"],

  // Chicken
  ["Chicken breast (raw)", "150 g", 150, 120, 22.5, 0, 2.6, 0, 0, 0.56, 45, 370, 5, 0.37, 28, 0.68, 0, 0.21, 0.1, "raw chicken boneless breast uncooked chicken weight"],
  ["Chicken thigh (raw, boneless)", "150 g", 150, 121, 19.7, 0, 4.1, 0, 0, 1.04, 95, 241, 7, 0.81, 23, 1.59, 0, 0.53, 0.1, "raw chicken boneless thigh leg uncooked"],
  ["Chicken curry cut (raw, with bone)", "250 g", 250, 87, 14.4, 0, 3.2, 0, 0, 0.85, 60, 210, 8, 0.5, 18, 1.1, 0, 0.25, 0.05, "raw chicken curry cut with bone skinless uncooked chicken weight"],
  ["Chicken breast (cooked, skinless)", "150 g", 150, 165, 31, 0, 3.6, 0, 0, 1, 74, 256, 15, 1, 29, 1, 0, 0.34, 0.1, "grilled chicken breast boiled chicken breast"],
  ["Chicken thigh (cooked, skinless)", "150 g", 150, 210, 26, 0, 11, 0, 0, 3, 90, 240, 12, 1.2, 23, 2.4, 0, 0.4, 0.1, "leg"],
  ["Butter chicken", "1 katori", 200, 210, 14, 6, 14.5, 0.8, 3.5, 7, 450, 250, 50, 0.9, 22, 1.3, 3, 0.3, 0.2, "murgh makhani"],
  ["Chicken tikka", "6 pieces", 150, 160, 25, 3, 5.5, 0.5, 1.5, 1.5, 450, 300, 30, 1.2, 28, 1.2, 2, 0.3, 0.1, ""],
  ["Tandoori chicken (meat only)", "2 pieces", 200, 165, 25, 3, 6, 0.5, 1.5, 1.7, 500, 300, 30, 1.2, 28, 1.8, 2, 0.3, 0.1, ""],
  ["Chicken keema", "1 katori", 150, 180, 18, 4, 10, 1, 1.5, 3, 380, 300, 25, 1.3, 25, 2, 3, 0.3, 0.1, "mince"],

  // Vegetables
  ["Aloo sabzi / jeera aloo", "1 katori", 150, 120, 2, 16, 5.5, 2, 1, 0.8, 300, 380, 12, 0.6, 22, 0.3, 10, 0, 0, "potato"],
  ["Aloo gobi", "1 katori", 150, 95, 2.5, 11, 4.8, 2.8, 2, 0.7, 300, 330, 25, 0.6, 18, 0.3, 30, 0, 0, "cauliflower"],
  ["Bhindi fry", "1 katori", 150, 110, 2.2, 8, 8, 3.5, 1.5, 1, 280, 300, 80, 0.7, 55, 0.6, 18, 0, 0, "okra ladyfinger"],
  ["Baingan bharta", "1 katori", 150, 90, 2, 8, 6, 3.5, 3.5, 0.8, 300, 250, 15, 0.4, 15, 0.2, 5, 0, 0, "brinjal eggplant"],
  ["Palak / spinach sabzi", "1 katori", 150, 70, 3, 5, 4.5, 2.5, 0.6, 0.6, 300, 500, 100, 2.5, 70, 0.5, 15, 0, 0, "saag"],
  ["Green salad", "1 bowl", 100, 20, 0.9, 4, 0.2, 1.3, 2.5, 0, 5, 200, 18, 0.3, 12, 0.2, 12, 0, 0, "cucumber tomato onion kachumber"],

  // Snacks, nuts & seeds
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
  ["Cashews", "10 cashews", 15, 553, 18.2, 30.2, 43.8, 3.3, 5.9, 7.8, 12, 660, 37, 6.7, 292, 5.8, 0.5, 0, 0, "kaju mundiri munthiri"],
  ["Pistachios", "20 kernels", 15, 560, 20.2, 27.2, 45.3, 10.6, 7.7, 5.9, 1, 1025, 105, 3.9, 121, 2.2, 5.6, 0, 0, "pista"],
  ["Pumpkin seeds", "1 tbsp", 10, 559, 30.2, 10.7, 49, 6, 1.4, 8.7, 7, 809, 46, 8.8, 592, 7.8, 1.9, 0, 0, "pepitas kaddu beej"],
  ["Sunflower seeds", "1 tbsp", 10, 584, 20.8, 20, 51.5, 8.6, 2.6, 4.5, 9, 645, 78, 5.25, 325, 5, 1.4, 0, 0, ""],
  ["Sesame seeds", "1 tbsp", 9, 573, 17.7, 23.4, 49.7, 11.8, 0.3, 7, 11, 468, 975, 14.6, 351, 7.8, 0, 0, 0, "til ellu gingelly"],
  ["Raisins", "1 tbsp", 10, 299, 3.1, 79.2, 0.5, 3.7, 59.2, 0.06, 11, 749, 50, 1.9, 32, 0.22, 2.3, 0, 0, "kishmish ularntha thiratchai dry grapes"],

  // Pizza Hut India (per 100 g, from Pizza Hut India's 2022 nutrition booklet; a medium pan pizza is 6 slices)
  ["Pizza Hut Corn n Cheese (pan)", "1 slice (medium)", 87.5, 319.5, 13.22, 48.48, 8.08, 2.84, 0, 3.79, 369, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut corn pizza sweet corn cheese pizza classic corn"],
  ["Pizza Hut Margherita (pan)", "1 slice (medium)", 78.5, 292.4, 12.89, 40.98, 8.56, 3.29, 0, 3.12, 577, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut margherita cheese pizza"],
  ["Pizza Hut Veggie Supreme (pan)", "1 slice (medium)", 108.5, 253.9, 10.57, 32.98, 8.59, 2.64, 0, 3.29, 352, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut veg supreme pizza"],
  ["Pizza Hut Tandoori Paneer (pan)", "1 slice (medium)", 102, 334.8, 11.21, 48.06, 10.87, 4.44, 0, 4.2, 605, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut paneer pizza"],
  ["Pizza Hut Chicken Tikka (pan)", "1 slice (medium)", 107, 275.2, 12.24, 33.77, 10.12, 4.77, 0, 4.31, 457, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut chicken pizza"],
  ["Pizza Hut Garlic Bread Stix", "1 order", 180, 287.2, 8.67, 61.78, 1.22, 2.44, 3.5, 0.22, 527, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut garlic bread sticks breadsticks breadstix"],
  ["Pizza Hut Cheese Garlic Bread", "1 order", 136, 362.9, 7.65, 40.29, 23.31, 3.01, 1.25, 19.63, 1273, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut cheesy garlic bread with cheese"],
  ["Pizza Hut Choco Volcano", "1 cake", 82, 319.1, 6.95, 55.73, 15.61, 3.17, 36.46, 12.07, 152, 0, 0, 0, 0, 0, 0, 0, 0, "pizza hut pizzahut choco lava cake chocolate volcano dessert"],

  // Fruit
  ["Banana", "1 medium", 110, 89, 1.1, 23, 0.3, 2.6, 12, 0.1, 1, 358, 5, 0.3, 27, 0.15, 8.7, 0, 0, "kela vazhaipazham pazham"],
  ["Apple", "1 medium", 180, 52, 0.3, 14, 0.2, 2.4, 10, 0, 1, 107, 6, 0.1, 5, 0, 4.6, 0, 0, "seb"],
  ["Papaya", "1 bowl", 150, 43, 0.5, 11, 0.3, 1.7, 8, 0.1, 8, 182, 20, 0.25, 21, 0.1, 61, 0, 0, "papita"],
  ["Orange", "1 orange", 130, 47, 0.9, 12, 0.1, 2.4, 9, 0, 0, 181, 40, 0.1, 10, 0.1, 53, 0, 0, "santra"],
  ["Guava", "1 medium", 150, 68, 2.6, 14.3, 0.95, 5.4, 8.9, 0.27, 2, 417, 18, 0.26, 22, 0.23, 228, 0, 0, "amrud koyya koyyapazham perakka seebe jama"],
  ["Mango", "1 cup", 165, 60, 0.8, 15, 0.4, 1.6, 14, 0.1, 1, 168, 11, 0.2, 10, 0.1, 36, 0, 0, "aam"],
  ["Watermelon", "1 bowl", 200, 30, 0.6, 7.6, 0.2, 0.4, 6.2, 0, 1, 112, 7, 0.2, 10, 0.1, 8, 0, 0, "tarbooz tharbusani kallangadi puchakaya"],
  ["Dates", "3 dates", 24, 280, 1.8, 75, 0.2, 7, 66, 0, 2, 696, 64, 0.9, 54, 0.4, 0, 0, 0, "khajoor"],
  ["Mousambi", "1 mousambi", 150, 43, 0.8, 9.3, 0.3, 0.8, 7, 0, 2, 180, 40, 0.7, 10, 0.1, 50, 0, 0, "sweet lime mosambi musambi sathukudi saathukudi"],
  ["Pomegranate", "1 cup arils", 170, 83, 1.7, 18.7, 1.2, 4, 13.7, 0.12, 3, 236, 10, 0.3, 12, 0.35, 10.2, 0, 0, "anar madhulai maadhulai"],
  ["Grapes", "1 cup", 150, 69, 0.7, 18.1, 0.2, 0.9, 15.5, 0.05, 2, 191, 10, 0.36, 7, 0.07, 3.2, 0, 0, "angoor thiratchai draksha"],
  ["Pineapple", "1 cup", 165, 50, 0.5, 13.1, 0.1, 1.4, 9.9, 0.01, 1, 109, 13, 0.29, 12, 0.12, 47.8, 0, 0, "ananas annachi"],
  ["Muskmelon", "1 bowl", 200, 34, 0.8, 8.2, 0.2, 0.9, 7.9, 0.05, 16, 267, 9, 0.21, 12, 0.18, 36.7, 0, 0, "kharbuja cantaloupe mulam pazham"],
  ["Sapota (chikoo)", "1 sapota", 80, 83, 0.4, 20, 1.1, 5.3, 14, 0.19, 12, 193, 21, 0.8, 12, 0.1, 14.7, 0, 0, "chiku sapodilla"],
  ["Jackfruit", "5 bulbs", 100, 95, 1.7, 23.3, 0.6, 1.5, 19.1, 0.2, 2, 448, 24, 0.23, 29, 0.13, 13.7, 0, 0, "palapazham chakka halasina kathal"],
  ["Custard apple", "1 fruit (pulp)", 100, 94, 2.1, 23.6, 0.3, 4.4, 16, 0.05, 9, 247, 24, 0.6, 21, 0.1, 36.3, 0, 0, "sitaphal seetha pazham sugar apple"],
  ["Pear", "1 medium", 170, 57, 0.4, 15.2, 0.1, 3.1, 9.8, 0.02, 1, 116, 9, 0.18, 7, 0.1, 4.3, 0, 0, "nashpati berikai"],
  ["Kiwi", "1 kiwi", 75, 61, 1.1, 14.7, 0.5, 3, 9, 0.03, 3, 312, 34, 0.31, 17, 0.14, 92.7, 0, 0, "kiwifruit"],
  ["Amla", "1 amla", 30, 44, 0.9, 10.2, 0.6, 4.3, 4, 0.04, 1, 198, 25, 0.31, 10, 0.12, 300, 0, 0, "gooseberry nellikai nellikkai usirikaya indian gooseberry"],
  ["Dragon fruit", "1 cup cubes", 150, 60, 1.1, 12, 0.4, 2, 10, 0.1, 2, 192, 13, 0.3, 14, 0.09, 3, 0, 0, "pitaya pitahaya kamalam"],

  // Juices (fresh, per 100 ml, no added sugar unless the name says so)
  ["Mousambi juice", "1 glass", 250, 38, 0.6, 9, 0.1, 0.2, 7.5, 0, 1, 150, 12, 0.2, 9, 0.05, 35, 0, 0, "sweet lime juice mosambi juice musambi juice sathukudi juice saathukudi juice"],
  ["Orange juice", "1 glass", 250, 45, 0.7, 10.4, 0.2, 0.2, 8.4, 0.02, 1, 200, 11, 0.2, 11, 0.05, 50, 0, 0, "santra juice fresh juice"],
  ["Watermelon juice", "1 glass", 250, 30, 0.6, 7.6, 0.15, 0.3, 6.2, 0.02, 1, 112, 7, 0.24, 10, 0.1, 8, 0, 0, "tarbooz juice fresh juice"],
  ["Pomegranate juice", "1 glass", 250, 54, 0.2, 13.1, 0.3, 0.1, 12.7, 0.08, 9, 214, 11, 0.1, 7, 0.09, 5, 0, 0, "anar juice madhulai juice fresh juice"],
  ["Pineapple juice", "1 glass", 250, 53, 0.4, 12.9, 0.1, 0.2, 10, 0.01, 2, 130, 13, 0.31, 12, 0.11, 20, 0, 0, "ananas juice fresh juice"],
  ["ABC juice (apple, beetroot, carrot)", "1 glass", 250, 43, 0.7, 10, 0.1, 0.5, 8, 0.02, 40, 250, 18, 0.4, 13, 0.2, 5, 0, 0, "beetroot juice carrot juice fresh juice"],
  ["Sugarcane juice", "1 glass", 250, 70, 0.2, 17.5, 0, 0, 16, 0, 10, 150, 15, 0.3, 10, 0.05, 2, 0, 0, "karumbu juice ganne ka ras kabbu"],
  ["Lemon juice (with sugar)", "1 glass", 250, 17, 0.05, 4.4, 0, 0, 4.1, 0, 40, 10, 1, 0.01, 1, 0, 3.8, 0, 0, "nimbu pani lime juice elumichai juice lemonade lime soda"],

  // Drinks & sweets
  ["Black coffee", "1 cup", 200, 2, 0.1, 0, 0, 0, 0, 0, 2, 50, 2, 0, 3, 0, 0, 0, 0, "americano espresso"],
  ["Sugar", "1 tsp", 5, 400, 0, 100, 0, 0, 100, 0, 1, 2, 1, 0.05, 0, 0, 0, 0, 0, "sakkarai cheeni chini"],
  ["Jaggery", "1 tbsp", 15, 383, 0.4, 98, 0.1, 0, 85, 0, 30, 1050, 80, 2.6, 70, 0.2, 0, 0, 0, "vellam gur bellam bella karupatti"],
  ["Honey", "1 tsp", 7, 304, 0.3, 82.4, 0, 0.2, 82.1, 0, 4, 52, 6, 0.42, 2, 0.22, 0.5, 0, 0, "then madhu shahad"],
  ["Gulab jamun", "1 piece", 50, 320, 4, 50, 12, 0.5, 40, 6, 80, 80, 70, 0.6, 10, 0.3, 0, 0.1, 0, "mithai sweet"],
  ["Jalebi", "2 pieces", 50, 410, 3, 60, 18, 0.5, 45, 8, 20, 30, 10, 0.8, 8, 0.2, 0, 0, 0, ""],
  ["Ice cream", "1 scoop", 66, 207, 3.5, 23.6, 11, 0.7, 21.2, 6.8, 80, 199, 128, 0.09, 14, 0.69, 0.6, 0.39, 0.2, "icecream vanilla chocolate strawberry butterscotch frozen dessert cup cone amul kwality walls"],
  ["Kheer", "1 bowl", 150, 140, 3.8, 20, 4.5, 0.2, 14, 2.8, 50, 150, 120, 0.2, 13, 0.4, 0.5, 0.3, 0, "rice pudding payasam paal payasam"],
];

// Nutrient keys in row order (after name, serving label, serving grams).
window.NUTRIENT_KEYS = ["kcal", "p", "c", "f", "fib", "sug", "sf", "na", "k", "ca", "fe", "mg", "zn", "vc", "b12", "vd"];

window.FOODS = window.FOOD_ROWS.map(function (r, i) {
  var per100 = {};
  window.NUTRIENT_KEYS.forEach(function (k, j) { per100[k] = r[3 + j]; });
  return { id: "b" + i, name: r[0], serving: { label: r[1], g: r[2] }, per100: per100, aliases: r[19] || "", builtin: true };
});
