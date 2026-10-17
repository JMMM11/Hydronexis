/**
 * Datos del Marketplace - Productos y Vendedores
 * Cada vegetal tiene 3 vendedores con precios, ubicación y reviews propias.
 */
const MARKETPLACE_DATA = {
  'romaine-lettuce': {
    id: 'romaine-lettuce',
    name: 'Romaine Lettuce',
    nameEs: 'Lechuga Romana',
    image: 'images/product-1-220x160.png',
    basePrice: '0.60',
    category: 'Leafy Greens',
    sellersPage: 'sellers-romaine-lettuce.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martinez',
        price: '0.75',
        description: 'Hydroponically grown Romaine lettuce using an advanced nutrient-flow growing system. Crisp, vibrant green leaves with exceptional freshness and long-lasting quality. Perfect for Caesar salads, wraps, and more.',
        sellerInfo: 'Hydroponic grower with over 8 years of experience, specializing in premium leafy lettuce. Fresh deliveries every Tuesday and Friday throughout La Chorrera.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panama',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'From the Pan-American Highway, take the exit toward La Chorrera. Continue for 2 km along the main road to the community market. The pickup location is clearly marked with a green Hydronexis sign.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'I absolutely loved it—amazing!!!!!!!!' },
          { author: 'Carlos Mendoza', stars: 5, date: 'august 15th, 2026', text: 'The lettuce arrived fresh, crisp, and full of flavor. Highly recommended!' }
        ]
      },
      {
        id: 'maria-rodriguez',
        name: 'María Rodriguez',
        price: '0.60',
        description: 'Organic Romaine lettuce, grown without pesticides. Cultivated in a climate-controlled greenhouse using a perfectly balanced nutrient solution for a tender texture and delicate flavor.',
        sellerInfo: 'Family-owned hydroponic farm since 2019. Certified in Good Agricultural Practices (GAP). Orders are conveniently accepted via WhatsApp.',
        location: {
          name: 'Mercado de Arraijan',
          address: 'Arraijan, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Located at Stall #12 in the Arraijan Municipal Market. Convenient parking is available behind the building for easy pickup.'
        },
        reviews: [
          { author: 'Ana Torres', stars: 4, date: 'july 20th, 2026', text: 'Excellent quality at a fair price. I will definitely be buying again!' }
        ]
      },
      {
        id: 'jose-hernandez',
        name: 'Jose Hernandez',
        price: '0.55',
        description: 'Freshly harvested Romaine lettuce, picked daily for peak freshness. Grown using an advanced Deep Water Culture (DWC) hydroponic system, it is perfect for immediate enjoyment or stays fresh for up to 5–7 days when properly stored.',
        sellerInfo: 'Agricultural Engineer and UDELAS graduate. Operates a 200 m² hydroponic farm dedicated to producing high-quality, fresh produce. Volume discounts are available for bulk orders.',
        location: {
          name: 'Finca Hydronexis West',
          address: 'Vía Centenario, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942!2d-79.70!3d8.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPanam%C3%A1%20Oeste!5e0!3m2!1ses!2spa!4v1700000000002',
          directions: 'Located at Km 12.5 on Vía Centenario. Turn right at the white entrance gate, then give us a call upon arrival for access.'
        },
        reviews: [
          { author: 'Pedro Sanchez', stars: 5, date: 'june 10th, 2026', text: 'Outstanding quality at an excellent price. The freshest lettuce on the market.' },
          { author: 'Lucia Vega', stars: 4, date: 'may 28th, 2026', text: 'Great quality, though the pickup location is a bit out of the way.' }
        ]
      }
    ]
  },

  'tomatoes': {
    id: 'tomatoes',
    name: 'Tomatoes',
    nameEs: 'Tomates',
    image: 'images/product-2-191x132.png',
    basePrice: '1.15',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-tomatoes.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martinez',
        price: '1.25',
        description: 'Hydroponically grown red tomatoes with a naturally sweet, juicy flavor. Perfect for fresh salads and harvested on the very day of delivery for peak freshness.',
        sellerInfo: 'Hydroponic grower with over 5 years of experience, specializing in premium greenhouse tomatoes.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panama',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Take the La Chorrera exit from the Pan-American Highway. Continue for 2 km along the main road until you reach the community market.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'I absolutely loved it—amazing!!!!' }
        ]
      },
      {
        id: 'carmen-vega',
        name: 'Carmen Vega',
        price: '1.15',
        description: 'Large, premium Beefsteak tomatoes grown hydroponically. Exceptionally juicy and perfect for sandwiches, burgers, and homemade sauces. Cultivated in a soilless system with precise EC and pH control to ensure outstanding quality and flavor.',
        sellerInfo: 'Agricultural entrepreneur since 2020 and an active participant in eco-friendly agricultural fairs across Panama Oeste.',
        location: {
          name: 'Capira Centro',
          address: 'Capira, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943!2d-79.58!3d8.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCapira!5e0!3m2!1ses!2spa!4v1700000000003',
          directions: 'Located in Capira Central Park, next to the organic produce stand. Pickup is available from 7:00 AM to 2:00 PM.'
        },
        reviews: [
          { author: 'Roberto Díaz', stars: 5, date: 'august 5th, 2026', text: 'The best tomatoes I have ever tasted in Panama! 🍅' }
        ]
      },
      {
        id: 'luis-morales',
        name: 'Luis Morales',
        price: '1.05',
        description: 'Premium Roma tomatoes with firm skin, meaty flesh, and low moisture content. Ideal for sauces, cooking, and recipes that call for rich flavor and exceptional yield.',
        sellerInfo: 'Former chef turned hydroponic grower, dedicated to producing gourmet-quality tomatoes for local restaurants and discerning home cooks.',
        location: {
          name: 'San Carlos',
          address: 'San Carlos, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944!2d-79.73!3d8.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan%20Carlos!5e0!3m2!1ses!2spa!4v1700000000004',
          directions: 'Located at the end of the main road in San Carlos. Look for the "Tomates LM" sign to easily find the farm.'
        },
        reviews: [
          { author: 'Isabel Ruiz', stars: 4, date: 'july 12th, 2026', text: 'Perfect for making rich, homemade tomato sauce.' }
        ]
      }
    ]
  },

  'spinach': {
    id: 'spinach',
    name: 'Spinach',
    nameEs: 'Espinaca',
    image: 'images/product-3-238x158.png',
    basePrice: '2.95',
    category: 'Leafy Greens',
    sellersPage: 'sellers-spinach.html',
    sellers: [
      {
        id: 'elena-castro',
        name: 'Elena Castro',
        price: '3.10',
        description: 'Tender baby spinach packed with iron and essential vitamins. Hydroponically grown for exceptional freshness, flavor, and nutritional value.',
        sellerInfo: 'Nutritionist and hydroponic grower with a passion for locally grown superfoods. Committed to producing fresh, nutrient-rich greens that support a healthy lifestyle.',
        location: {
          name: 'La Chorrera Centro',
          address: 'La Chorrera, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Located at Stall #5 in the leafy greens section of the Municipal Market.'
        },
        reviews: [
          { author: 'Marta Jiménez', stars: 5, date: 'august 22nd, 2026', text: 'Exceptionally tender spinach—perfect for smoothies, salads, and other fresh recipes.' }
        ]
      },
      {
        id: 'ricardo-pena',
        name: 'Ricardo Peña',
        price: '2.95',
        description: 'Traditional large-leaf spinach with a mild flavor and consistently tender texture. Perfect for cooking, sautéing, or adding to your favorite recipes.',
        sellerInfo: 'Third-generation farmer who has successfully transitioned to hydroponic farming, combining generations of agricultural expertise with modern growing techniques.',
        location: {
          name: 'Arraijan',
          address: 'Arraijan, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Located at Module 3 of the Arraijan Agricultural Cooperative.'
        },
        reviews: [
          { author: 'Felipe Ortiz', stars: 4, date: 'july 8th, 2026', text: 'Great quality at a great price.' }
        ]
      },
      {
        id: 'sofia-ramirez',
        name: 'Sofia Ramírez',
        price: '2.80',
        description: 'Certified organic spinach, grown without synthetic chemicals. Enjoy a guaranteed weekly harvest of fresh, premium-quality greens.',
        sellerInfo: 'Marine biologist turned sustainable hydroponic grower, passionate about producing fresh, environmentally responsible food.',
        location: {
          name: 'Vista Alegre',
          address: 'Vista Alegre, Arraijan',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945!2d-79.68!3d8.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVista%20Alegre!5e0!3m2!1ses!2spa!4v1700000000006',
          directions: 'Located at 45 Third Street in Vista Alegre. The greenhouse is clearly visible from the street, making it easy to find.'
        },
        reviews: [
          { author: 'Daniela Mora', stars: 5, date: 'june 30th, 2026', text: 'Truly organic—you can taste the difference.' }
        ]
      }
    ]
  },

  'chives': {
    id: 'chives',
    name: 'Chives',
    nameEs: 'Cebollín',
    image: 'images/product-4-204x125.png',
    basePrice: '0.30',
    category: 'Herbs & Steams',
    sellersPage: 'sellers-chives.html',
    sellers: [
      {
        id: 'pedro-gomez',
        name: 'Pedro Gómez',
        price: '0.35',
        description: 'Fresh chives, harvested daily for maximum freshness. Bursting with vibrant aroma and a delicate flavor, they are the perfect finishing touch for soups, salads, and Asian-inspired dishes.',
        sellerInfo: 'Specialist in hydroponically grown aromatic herbs, dedicated to producing fresh, flavorful, and high-quality greens.',
        location: {
          name: 'La Chorrera',
          address: 'La Chorrera, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Located at the market of farmers, herb aisle, Green Stall.'
        },
        reviews: [
          { author: 'Gabriela León', stars: 5, date: 'august 18th, 2026', text: 'Very fresh and stays fresh for a long time in the refrigerator.' }
        ]
      },
      {
        id: 'ana-lopez',
        name: 'Ana Lopez',
        price: '0.30',
        description: 'Fresh chives available in 100g bundles. Grown in vertical hydroponic towers for maximum space efficiency while maintaining premium freshness and quality.',
        sellerInfo: 'Emprendedora en agricultura vertical urbana.',
        location: {
          name: 'Panama Oeste',
          address: 'Vía Israel, La Chorrera',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Located on the second floor of the Vía Israel commercial building, Suite 4B.'
        },
        reviews: [
          { author: 'Tomás Herrera', stars: 4, date: 'july 25th, 2026', text: 'Great product, excellent service.' }
        ]
      },
      {
        id: 'miguel-santos',
        name: 'Miguel Santos',
        price: '0.28',
        description: 'Premium chives in vacuum-sealed packaging. Enjoy extended shelf life and guaranteed freshness for up to 10 days.',
        sellerInfo: 'Food technologist and innovator specializing in advanced packaging solutions for fresh herbs.',
        location: {
          name: 'Feria del Agricultor',
          address: 'Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Farmers Market every Saturday from 6:00 AM to 12:00 PM. Stall #22.'
        },
        reviews: [
          { author: 'Claudia Reyes', stars: 5, date: 'june 15th, 2026', text: 'The vacuum-sealed packaging is amazing—it stays fresh and does not wilt.' }
        ]
      }
    ]
  },

  'butterhead-lettuce': {
    id: 'butterhead-lettuce',
    name: 'Butterhead Lettuce',
    nameEs: 'Lechuga Mantecosa',
    image: 'images/product-5-204x156.png',
    basePrice: '0.65',
    category: 'Leafy Greens',
    sellersPage: 'sellers-butterhead-lettuce.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martinez',
        photo: 'images/vendedores/Alberto_Cortez_color.jpg',
        price: '0.75',
        description: 'Butterhead lettuce with soft leaves and a compact shape. Its creamy texture makes it ideal for gourmet salads and healthy wraps.',
        sellerInfo: 'Producer with 8 years of experience in hydroponics and a strong focus on leafy crops.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panama',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'From the Pan-American Highway, take the exit toward La Chorrera. Continue 2 km to the community market.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'I really liked it, amazing!' }
        ]
      },
      {
        id: 'patricia-nunez',
        name: 'Patricia Núñez',
        price: '0.65',
        description: 'Hydroponic greenhouse butterhead lettuce with tender leaves and a consistent vibrant green color. Home delivery available.',
        sellerInfo: 'Nurse and hydroponic grower. Delivery service available every Wednesday.',
        location: {
          name: 'Nuevo Emperador',
          address: 'Nuevo Emperador, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946!2d-79.72!3d8.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNuevo%20Emperador!5e0!3m2!1ses!2spa!4v1700000000007',
          directions: 'Located at Los Olivos Residential, House #8. Ring the green doorbell upon arrival.'
        },
        reviews: [
          { author: 'Héctor Vargas', stars: 4, date: 'august 10th, 2026', text: 'On-time delivery and fresh, high-quality products.' }
        ]
      },
      {
        id: 'fernando-cruz',
        name: 'Fernando Cruz',
        price: '0.58',
        description: 'Live butterhead lettuce in a pot. Delivered with roots attached for maximum freshness and a longer shelf life of up to 2 weeks when refrigerated.',
        sellerInfo: 'Innovator in the sale of live plants for fresh consumption.',
        location: {
          name: 'Chame',
          address: 'Chame, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947!2d-79.88!3d8.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sChame!5e0!3m2!1ses!2spa!4v1700000000008',
          directions: 'Located along the Interamerican Highway, km 52. Look for the greenhouse with the white dome.'
        },
        reviews: [
          { author: 'Laura Méndez', stars: 5, date: 'july 3rd, 2026', text: 'The live plant concept is excellent.' }
        ]
      }
    ]
  },

  'radish': {
    id: 'radish',
    name: 'Radish',
    nameEs: 'Rabano',
    image: 'images/product-6-237x156.png',
    basePrice: '0.65',
    category: 'Root Vegetables',
    sellersPage: 'sellers-radish.html',
    sellers: [
      {
        id: 'jorge-mendez',
        name: 'Jorge Méndez',
        price: '0.70',
        description: 'Crisp red radishes with a short 25-day growing cycle. Spicy, refreshing, and perfect for salads and elegant garnishes.',
        sellerInfo: 'Specialist in short-cycle hydroponic crops, focused on efficient and sustainable fresh produce cultivation.',
        location: {
          name: 'La Chorrera',
          address: 'La Chorrera, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Located at the Municipal Market, roots and tubers section.'
        },
        reviews: [
          { author: 'Oscar Blanco', stars: 5, date: 'august 28th, 2026', text: 'Crisp, fresh, and excellent quality.' }
        ]
      },
      {
        id: 'diana-flores',
        name: 'Diana Flores',
        price: '0.65',
        description: 'Hydroponic white daikon radishes. Mild and versatile, perfect for Asian cuisine and pickling.',
        sellerInfo: 'Chef and producer of specialty vegetables.',
        location: {
          name: 'Arraijan',
          address: 'Arraijan, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'La Huerta Restaurant, purchases available at the reception desk from 9:00 AM to 5:00 PM.'
        },
        reviews: [
          { author: 'Kenji Tanaka', stars: 5, date: 'july 17th, 2026', text: 'Perfect daikon for my recipes!' }
        ]
      },
      {
        id: 'raul-espinoza',
        name: 'Raúl Espinoza',
        price: '0.60',
        description: 'Multicolor radish mix (red, white, and purple). An attractive presentation, perfect for restaurants and special events.',
        sellerInfo: 'Supplier of fresh produce for restaurants in West Panama.',
        location: {
          name: 'Vista Alegre',
          address: 'Vista Alegre, Arraijan',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945!2d-79.68!3d8.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVista%20Alegre!5e0!3m2!1ses!2spa!4v1700000000006',
          directions: 'Vista Alegre Warehouse, main street, blue gate.'
        },
        reviews: [
          { author: 'Marina Costa', stars: 4, date: 'june 22nd, 2026', text: 'Beautiful colors and great flavor.' }
        ]
      }
    ]
  },

  'red-bell-peppers': {
    id: 'red-bell-peppers',
    name: 'Red Bell Peppers',
    nameEs: 'Pimentón Rojo',
    image: 'images/product-7-210x168.png',
    basePrice: '2.00',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-red-bell-peppers.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martinez',
        price: '2.15',
        description: 'Ripe red bell peppers, sweet and fleshy with a high vitamin C content. Perfect for roasting, stuffing, or enjoying fresh.',
        sellerInfo: 'Farmer with 10 years of experience, specializing in growing solanaceous crops with care and dedication.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panama',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Sales point in Ciudad del Niño, La Chorrera. Local growers’ area.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'I loved it, amazing!!!!!' }
        ]
      },
      {
        id: 'gloria-aguilar',
        name: 'Gloria Aguilar',
        price: '2.00',
        description: 'Greenhouse-grown red bell peppers. Bright, thick skin and a uniform size, ideal for commercial packaging.',
        sellerInfo: 'Local exporter of hydroponic vegetables.',
        location: {
          name: 'Capira',
          address: 'Capira, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943!2d-79.58!3d8.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCapira!5e0!3m2!1ses!2spa!4v1700000000003',
          directions: 'Capira packing facility, industrial area.'
        },
        reviews: [
          { author: 'Ernesto Paredes', stars: 4, date: 'august 3rd, 2026', text: 'Uniform size and good quality.' }
        ]
      },
      {
        id: 'victor-salazar',
        name: 'Víctor Salazar',
        price: '1.90',
        description: 'Mini red bell peppers for gourmet dishes. Perfect for individual servings and catering, with a rich and concentrated flavor.',
        sellerInfo: 'Executive chef and small-scale producer.',
        location: {
          name: 'San Carlos',
          address: 'San Carlos, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944!2d-79.73!3d8.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSan%20Carlos!5e0!3m2!1ses!2spa!4v1700000000004',
          directions: 'San Carlos gourmet farm. Appointments available by WhatsApp.'
        },
        reviews: [
          { author: 'Chef Andrés', stars: 5, date: 'july 1st, 2026', text: 'Perfect size for fine dining plates.' }
        ]
      }
    ]
  },

  'yellow-bell-peppers': {
    id: 'yellow-bell-peppers',
    name: 'Yellow Bell Peppers',
    nameEs: 'Pimentón Amarillo',
    image: 'images/product-8-210x133.png',
    basePrice: '2.00',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-yellow-bell-peppers.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martinez',
        price: '2.10',
        description: 'Sweet yellow bell peppers with a hint of citrus flavor. Perfect for stir-fries, pizzas, and Mediterranean dishes.',
        sellerInfo: 'Farmer with 4 years of experience, dedicated to growing fresh and quality produce.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panama',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Local community market, fresh bell pepper section.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'I really enjoyed it, absolutely amazing!' }
        ]
      },
      {
        id: 'monica-rivera',
        name: 'Mónica Rivera',
        price: '2.00',
        description: 'Thick-walled yellow bell peppers, perfect for stuffing. Grown in coconut coir with an automated irrigation system for careful and consistent cultivation.',
        sellerInfo: 'Small family grower with experience caring for irrigation and hydroponic crops. A home-based farm dedicated to producing fresh, quality vegetables with care.',
        location: {
          name: 'Nuevo Arraijan',
          address: 'Nuevo Arraijan, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Nuevo Arraijan neighborhood, block 4, lot 12.'
        },
        reviews: [
          { author: 'Sandra Ortiz', stars: 4, date: 'august 14th, 2026', text: 'Perfect for stuffing, with a thick and juicy texture.' }
        ]
      },
      {
        id: 'hector-davila',
        name: 'Héctor Dávila',
        price: '1.85',
        description: 'Eco-friendly yellow bell peppers, grown naturally without wax or post-harvest treatments. Fresh, bright color straight from the farm.',
        sellerInfo: 'Agricultor certificado en producción ecológica.',
        location: {
          name: 'La Chorrera',
          address: 'La Chorrera, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa%20Chorrera!5e0!3m2!1ses!2spa!4v1700000000005',
          directions: 'Eco-store in La Chorrera, right in front of the central park.'
        },
        reviews: [
          { author: 'Paula Nieto', stars: 5, date: 'june 8th, 2026', text: '100% natural, you can taste the difference.' }
        ]
      }
    ]
  },

  'green-bell-peppers': {
    id: 'green-bell-peppers',
    name: 'Green Bell Peppers',
    nameEs: 'Pimentón Verde',
    image: 'images/product-9-185x155.png',
    basePrice: '2.00',
    category: 'Fruit Vegetables',
    sellersPage: 'sellers-green-bell-peppers.html',
    sellers: [
      {
        id: 'alberto-martinez',
        name: 'Alberto Martinez',
        price: '2.05',
        description: 'Fresh green bell peppers, firm and crisp with a natural flavor. Perfect for traditional Latin dishes, homemade sofritos, and family recipes.',
        sellerInfo: 'Farmer with 3 years of experience, dedicated to caring for crops and providing fresh produce with hard work and love for farming.',
        location: {
          name: 'La Ciudad del Niño',
          address: 'V68H+CH3, La Chorrera, Panama',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d-79.783!3d8.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca3c3c3c3c3c3%3A0x0!2sLa%20Ciudad%20del%20Ni%C3%B1o!5e0!3m2!1ses!2spa!4v1700000000000',
          directions: 'Calle del Puerto, La Chorrera, West Panama.'
        },
        reviews: [
          { author: 'Velinda Guitierres', stars: 5, date: 'september 1st, 2026', text: 'Amazing!!!!' }
        ]
      },
      {
        id: 'beatriz-campos',
        name: 'Beatriz Campos',
        price: '2.00',
        description: 'Large green bell peppers carefully grown for quality. Selected by size and packed with care in 5 kg boxes for delivery.',
        sellerInfo: 'Small local seller offering fresh hydroponic vegetables in larger quantities.',
        location: {
          name: 'Arraijan',
          address: 'Arraijan, Panama Oeste',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941!2d-79.65!3d8.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArraij%C3%A1n!5e0!3m2!1ses!2spa!4v1700000000001',
          directions: 'Arraijan collection center, warehouse #7.'
        },
        reviews: [
          { author: 'Distribuidora Fresh', stars: 4, date: 'august 20th, 2026', text: 'Good size and quality, perfect for local resale.' }
        ]
      },
      {
        id: 'edgar-wong',
        name: 'Edgar Wong',
        price: '1.80',
        description: 'Fresh Asian green bell peppers with a thin wall and delicate flavor. Perfect for homemade stir-fries, wok dishes, and quick cooking with a touch of tradition.',
        sellerInfo: 'Local farmer dedicated to growing Asian vegetables with care and passion for fresh produce.',
        location: {
          name: 'Panama Oeste',
          address: 'Vía Centenario, La Chorrera',
          embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942!2d-79.70!3d8.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPanam%C3%A1%20Oeste!5e0!3m2!1ses!2spa!4v1700000000002',
          directions: 'Wong greenhouse, km 10 along Vía Centenario.'
        },
        reviews: [
          { author: 'Li Wei', stars: 5, date: 'july 30th, 2026', text: 'Authentic taste for stir fry dishes.' }
        ]
      }
    ]
  }
};

/** SVG icono de avatar de usuario */
const SELLER_AVATAR_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" fill="#222"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7" fill="#222"/></svg>';

/** SVG icono de chat */
const CHAT_ICON_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#222" fill="none" stroke-width="1.5"/></svg>';

/** Genera estrellas HTML */
function renderStars(count) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < count ? '★' : '☆';
  }
  return stars;
}
