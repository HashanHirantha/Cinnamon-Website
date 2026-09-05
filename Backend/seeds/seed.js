import bcrypt from 'bcryptjs';
import db from '../config/firebase.js';

const seedDatabase = async () => {
  console.log('🌱 Starting Firestore database seed for PURE GOLD Products...');

  try {
    // 1. Seed Categories
    console.log('📦 Seeding categories...');
    const categories = [
      {
        id: 'quills',
        name: 'Cinnamon Quills',
        slug: 'quills',
        description: 'Premium whole cinnamon quills, hand-rolled by skilled artisans',
        image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=700&q=80',
        productCount: 3,
      },
      {
        id: 'powder',
        name: 'Cinnamon Powder',
        slug: 'powder',
        description: 'Finely ground Ceylon cinnamon powder, full of flavour & warmth',
        image: 'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=700&q=80',
        productCount: 2,
      },
      {
        id: 'tea',
        name: 'Cinnamon Tea',
        slug: 'tea',
        description: 'Aromatic loose-leaf and bagged cinnamon teas',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&q=80',
        productCount: 1,
      },
      {
        id: 'oils',
        name: 'Cinnamon Oils',
        slug: 'oils',
        description: 'Pure essential oils cold-pressed from Ceylon cinnamon bark & leaf',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700&q=80',
        productCount: 1,
      },
      {
        id: 'gifts',
        name: 'Gift Collections',
        slug: 'gifts',
        description: 'Curated gift sets — perfect for any occasion or export gifting',
        image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=700&q=80',
        productCount: 1,
      },
    ];

    for (const cat of categories) {
      await db.collection('categories').doc(cat.id).set({
        ...cat,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    console.log(`✅ ${categories.length} categories seeded.`);

    // 2. Seed Products
    console.log('🌿 Seeding products...');
    const products = [
      {
        id: 'ceylon-cinnamon-quills-premium',
        slug: 'ceylon-cinnamon-quills-premium',
        name: 'Ceylon Cinnamon Quills — Premium Grade',
        shortDescription: 'Hand-rolled True Ceylon quills, the gold standard of cinnamon',
        description: 'Our Premium Grade Ceylon Cinnamon Quills are sourced directly from the cinnamon gardens of Galle and Matara in Southern Sri Lanka, where quill-making is a centuries-old art. Each quill is meticulously hand-rolled by skilled craftspeople and dried under natural sunlight, preserving the delicate volatile oils that give Ceylon cinnamon its distinctive, complex flavour.\n\nUnlike cassia cinnamon, true Ceylon cinnamon contains only trace amounts of coumarin, making it the safest and most desirable form of cinnamon for everyday use.',
        category: 'quills',
        image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
          'https://images.unsplash.com/photo-1601093475680-0d31c07fdd9e?w=600&q=80',
          'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=600&q=80'
        ],
        price: 18.99,
        originalPrice: 24.99,
        weight: '100g',
        origin: 'Galle, Sri Lanka',
        ingredients: '100% Ceylon Cinnamon (Cinnamomum verum)',
        processing: 'Sun-dried, hand-rolled',
        shipping: 'Ships within 1-2 business days. International delivery in 7-14 days.',
        rating: 4.9,
        reviewCount: 142,
        stock: 85,
        inStock: true,
        badge: 'Best Seller',
        featured: true,
        tags: ['quills', 'premium', 'authentic', 'gift-worthy'],
      },
      {
        id: 'ceylon-cinnamon-powder-fine-grade',
        slug: 'ceylon-cinnamon-powder-fine-grade',
        name: 'Ceylon Cinnamon Powder — Fine Grade',
        shortDescription: 'Finely milled Ceylon cinnamon powder, rich in aroma',
        description: 'Our Fine Grade Ceylon Cinnamon Powder is produced by stone-milling premium quills to a silky consistency that retains the full spectrum of volatile oils and natural colour. With its warm, golden-brown hue and delicately sweet, slightly floral notes, it is the ideal baking and culinary companion for chefs and home cooks alike.\n\nFree from additives, fillers, and artificial colouring — just pure, unadulterated Ceylon cinnamon.',
        category: 'powder',
        image: 'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=600&q=80',
          'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
          'https://images.unsplash.com/photo-1599909631901-56f3ee9e9e41?w=600&q=80'
        ],
        price: 12.99,
        originalPrice: null,
        weight: '200g',
        origin: 'Kurunegala, Sri Lanka',
        ingredients: '100% Ceylon Cinnamon (Cinnamomum verum)',
        processing: 'Stone-milled, air-dried',
        shipping: 'Ships within 1-2 business days. International delivery in 7-14 days.',
        rating: 4.8,
        reviewCount: 98,
        stock: 120,
        inStock: true,
        badge: null,
        featured: true,
        tags: ['powder', 'baking', 'cooking'],
      },
      {
        id: 'cinnamon-herbal-tea',
        slug: 'cinnamon-herbal-tea',
        name: 'Cinnamon Herbal Tea — Loose Leaf',
        shortDescription: 'Soothing loose-leaf cinnamon tea blend for wellness',
        description: 'A warm, aromatic infusion crafted from premium Ceylon cinnamon bark pieces blended with natural lemongrass and dried ginger. Caffeine-free and wonderfully soothing, this herbal tea is perfect for unwinding after a long day or beginning your morning with a gentle, spiced ritual.\n\nEach steeping releases a rich amber liquor with a natural sweetness that requires no added sugar.',
        category: 'tea',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
          'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80'
        ],
        price: 14.99,
        originalPrice: 17.99,
        weight: '75g (approx. 30 servings)',
        origin: 'Kandy, Sri Lanka',
        ingredients: 'Ceylon cinnamon bark, lemongrass, dried ginger',
        processing: 'Air-dried, sorted',
        shipping: 'Ships within 1-2 business days. International delivery in 7-14 days.',
        rating: 4.7,
        reviewCount: 67,
        stock: 60,
        inStock: true,
        badge: null,
        featured: true,
        tags: ['tea', 'herbal', 'wellness', 'caffeine-free'],
      },
      {
        id: 'cinnamon-sticks-select-grade',
        slug: 'cinnamon-sticks-select-grade',
        name: 'Cinnamon Sticks — Select Grade',
        shortDescription: 'Thick, aromatic select-grade cinnamon sticks',
        description: 'Select Grade Ceylon cinnamon sticks ideal for infusing mulled wines, syrups, rice dishes, and hot beverages. Thicker than quills, these sticks provide a more intense spice kick and look stunning as table decorations or in festive drinks. Sourced from certified organic farms in the cinnamon heartland of Sri Lanka.',
        category: 'quills',
        image: 'https://images.unsplash.com/photo-1601093475680-0d31c07fdd9e?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1601093475680-0d31c07fdd9e?w=600&q=80',
          'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80'
        ],
        price: 9.99,
        originalPrice: null,
        weight: '150g',
        origin: 'Matara, Sri Lanka',
        ingredients: '100% Ceylon Cinnamon (Cinnamomum verum)',
        processing: 'Sun-dried',
        shipping: 'Ships within 1-2 business days. International delivery in 7-14 days.',
        rating: 4.6,
        reviewCount: 53,
        stock: 200,
        inStock: true,
        badge: null,
        featured: false,
        tags: ['sticks', 'cooking', 'beverages'],
      },
      {
        id: 'cinnamon-essential-oil',
        slug: 'cinnamon-essential-oil',
        name: 'Ceylon Cinnamon Essential Oil',
        shortDescription: '100% pure cold-pressed cinnamon bark essential oil',
        description: 'Distilled from the inner bark of Cinnamomum verum trees grown in Sri Lanka, this therapeutic-grade cinnamon essential oil is prized by aromatherapists and natural wellness practitioners worldwide. It carries a warm, sweet-spicy aroma with balsamic undertones and is known for its naturally warming and uplifting properties.\n\nDilute in a carrier oil before topical use. Not for internal consumption.',
        category: 'oils',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80'],
        price: 34.99,
        originalPrice: 42.00,
        weight: '30ml',
        origin: 'Galle, Sri Lanka',
        ingredients: 'Cinnamomum verum bark oil (100%)',
        processing: 'Steam-distilled',
        shipping: 'Ships within 1-2 business days. International delivery in 7-14 days.',
        rating: 4.9,
        reviewCount: 89,
        stock: 40,
        inStock: true,
        badge: 'Premium',
        featured: true,
        tags: ['oil', 'essential oil', 'aromatherapy', 'wellness'],
      },
      {
        id: 'cinnamon-gift-box-collection',
        slug: 'cinnamon-gift-box-collection',
        name: 'Ceylon Cinnamon Gift Box',
        shortDescription: 'A curated luxury gift box featuring our finest cinnamon range',
        description: 'Our signature gift box is the perfect introduction to the world of Ceylon cinnamon. Presented in a handcrafted bamboo box, this collection includes:\n\n• 50g Premium Quills\n• 50g Fine Cinnamon Powder\n• 25g Cinnamon Tea\n• 10ml Cinnamon Essential Oil\n\nEach item is individually wrapped with natural twine and accompanied by a card explaining the origin and heritage of Ceylon cinnamon. Makes an ideal corporate gift, wedding favour, or special occasion present.',
        category: 'gifts',
        image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&q=80',
          'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
          'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=600&q=80'
        ],
        price: 64.99,
        originalPrice: 79.99,
        weight: 'Set',
        origin: 'Sri Lanka',
        ingredients: 'Ceylon cinnamon quills, powder, tea, essential oil',
        processing: 'Curated collection',
        shipping: 'Ships within 2-3 business days. International delivery in 7-14 days.',
        rating: 5.0,
        reviewCount: 34,
        stock: 25,
        inStock: true,
        badge: 'Gift',
        featured: true,
        tags: ['gift', 'collection', 'luxury', 'premium', 'gift-worthy'],
      },
      {
        id: 'organic-cinnamon-powder',
        slug: 'organic-cinnamon-powder',
        name: 'Organic Ceylon Cinnamon Powder',
        shortDescription: 'Certified organic Ceylon cinnamon, cold-stone milled',
        description: 'Our Organic Certified Ceylon Cinnamon Powder is produced under strict organic farming standards with no synthetic pesticides or fertilisers. Cold-stone milled to preserve maximum flavour and nutrient integrity, this powder is the choice of health-conscious chefs, Ayurvedic practitioners, and discerning home cooks.\n\nCertified by the Export Development Board of Sri Lanka.',
        category: 'powder',
        image: 'https://images.unsplash.com/photo-1599909631901-56f3ee9e9e41?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1599909631901-56f3ee9e9e41?w=600&q=80',
          'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=600&q=80'
        ],
        price: 15.99,
        originalPrice: null,
        weight: '100g',
        origin: 'Ratnapura, Sri Lanka',
        ingredients: '100% Organic Ceylon Cinnamon (Cinnamomum verum)',
        processing: 'Cold-stone milled, organic certified',
        shipping: 'Ships within 1-2 business days. International delivery in 7-14 days.',
        rating: 4.8,
        reviewCount: 76,
        stock: 80,
        inStock: true,
        badge: 'Organic',
        featured: false,
        tags: ['organic', 'powder', 'certified', 'healthy'],
      },
      {
        id: 'premium-export-pack',
        slug: 'premium-export-pack',
        name: 'Premium Export Pack — Quills & Powder',
        shortDescription: 'Large-quantity export-grade pack for culinary professionals',
        description: 'Designed for restaurants, specialty food retailers, and culinary professionals, our Premium Export Pack provides superior Ceylon cinnamon in generous quantities. This pack includes 500g of premium quills and 500g of fine-grade powder, both vacuum-sealed for maximum freshness.\n\nConforming to EU and US food safety import standards. Certificate of Origin included.',
        category: 'quills',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
          'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
          'https://images.unsplash.com/photo-1584975380568-e6e3b3e09f87?w=600&q=80'
        ],
        price: 89.99,
        originalPrice: 109.99,
        weight: '1kg (500g each)',
        origin: 'Galle & Matara, Sri Lanka',
        ingredients: '100% Ceylon Cinnamon (Cinnamomum verum)',
        processing: 'Sun-dried, vacuum-sealed',
        shipping: 'Ships within 2-3 business days. International delivery in 7-14 days.',
        rating: 4.9,
        reviewCount: 22,
        stock: 30,
        inStock: true,
        badge: 'Export Grade',
        featured: false,
        tags: ['export', 'wholesale', 'professional', 'large quantity'],
      },
    ];

    for (const prod of products) {
      await db.collection('products').doc(prod.id).set({
        ...prod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    console.log(`✅ ${products.length} products seeded.`);

    // 3. Seed Staff Members
    console.log('👥 Seeding admin staff accounts...');
    const salt = await bcrypt.genSalt(10);
    const staffList = [
      {
        id: 'staff-admin-01',
        name: 'Hashan Hirantha (Admin)',
        username: 'admin',
        email: 'admin@ceyloncinnamon.com',
        passwordHash: await bcrypt.hash('ceylon@2025', salt),
        role: 'superadmin',
        permissions: ['all'],
        status: 'active',
      },
      {
        id: 'staff-products-02',
        name: 'Nimal Perera',
        username: 'products',
        email: 'products@ceyloncinnamon.com',
        passwordHash: await bcrypt.hash('products@2025', salt),
        role: 'product_manager',
        permissions: ['products', 'categories', 'inventory'],
        status: 'active',
      },
      {
        id: 'staff-orders-03',
        name: 'Kasun Silva',
        username: 'orders',
        email: 'orders@ceyloncinnamon.com',
        passwordHash: await bcrypt.hash('orders@2025', salt),
        role: 'order_manager',
        permissions: ['orders', 'customers', 'delivery'],
        status: 'active',
      },
      {
        id: 'staff-support-04',
        name: 'Dilani Fernando',
        username: 'support',
        email: 'support@ceyloncinnamon.com',
        passwordHash: await bcrypt.hash('support@2025', salt),
        role: 'customer_support',
        permissions: ['customers', 'orders', 'reviews'],
        status: 'active',
      },
    ];

    for (const staff of staffList) {
      await db.collection('staff').doc(staff.id).set({
        ...staff,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    console.log(`✅ ${staffList.length} staff accounts seeded.`);

    // 4. Seed Reviews
    console.log('⭐ Seeding customer reviews...');
    const reviews = [
      {
        id: 'rev-01',
        productId: 'ceylon-cinnamon-quills-premium',
        productName: 'Ceylon Cinnamon Quills — Premium Grade',
        author: 'Sophie Laurent',
        location: 'France 🇫🇷',
        rating: 5,
        date: '2024-05-12',
        title: 'Absolutely extraordinary quality',
        comment: 'I have tried cinnamon from many sources, but PURE GOLD Products is on another level entirely. The aroma is intoxicating, the quills are perfectly rolled, and the flavour is unlike any cassia variety.',
        status: 'approved',
        verified: true,
      },
      {
        id: 'rev-02',
        productId: 'ceylon-cinnamon-quills-premium',
        productName: 'Ceylon Cinnamon Quills — Premium Grade',
        author: 'James Whitfield',
        location: 'United Kingdom 🇬🇧',
        rating: 5,
        date: '2024-04-28',
        title: 'Premium packaging, premium product',
        comment: 'The packaging alone is stunning — but the real star is the cinnamon. Clean, warm, and genuinely authentic Ceylon.',
        status: 'approved',
        verified: true,
      },
      {
        id: 'rev-03',
        productId: 'ceylon-cinnamon-powder-fine-grade',
        productName: 'Ceylon Cinnamon Powder — Fine Grade',
        author: 'Ananya Krishnan',
        location: 'Singapore 🇸🇬',
        rating: 5,
        date: '2024-04-15',
        title: 'Best Ceylon cinnamon I have tasted',
        comment: 'As someone who cooks with spices daily, the difference between real Ceylon cinnamon and cassia is immediately noticeable.',
        status: 'approved',
        verified: true,
      },
      {
        id: 'rev-04',
        productId: 'cinnamon-herbal-tea',
        productName: 'Cinnamon Herbal Tea — Loose Leaf',
        author: 'Fatima Al-Mansoori',
        location: 'UAE 🇦🇪',
        rating: 5,
        date: '2024-03-10',
        title: 'Exceeded all expectations',
        comment: 'The cinnamon tea especially — absolutely divine. Will be recommending to everyone I know.',
        status: 'approved',
        verified: true,
      },
    ];

    for (const rev of reviews) {
      await db.collection('reviews').doc(rev.id).set({
        ...rev,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    console.log(`✅ ${reviews.length} reviews seeded.`);

    // 5. Seed Coupons
    console.log('🏷️ Seeding coupons...');
    const coupons = [
      { id: 'coup-01', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 30, maxDiscount: 20, isActive: true },
      { id: 'coup-02', code: 'SUMMER25', type: 'percentage', value: 25, minOrder: 50, maxDiscount: 30, isActive: true },
      { id: 'coup-03', code: 'FLAT10', type: 'fixed', value: 10, minOrder: 40, maxDiscount: null, isActive: true },
    ];

    for (const c of coupons) {
      await db.collection('coupons').doc(c.id).set({
        ...c,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    console.log(`✅ ${coupons.length} coupons seeded.`);

    // 6. Seed Delivery Zones
    console.log('🚚 Seeding delivery zones...');
    const zones = [
      { id: 'zone-01', name: 'Domestic (Sri Lanka)', country: 'Sri Lanka', baseRate: 2.50, freeShippingThreshold: 30, estimatedDays: '1-3 business days', isActive: true },
      { id: 'zone-02', name: 'South Asia', country: 'Regional', baseRate: 8.00, freeShippingThreshold: 60, estimatedDays: '5-10 business days', isActive: true },
      { id: 'zone-03', name: 'Europe & UK', country: 'Europe', baseRate: 10.00, freeShippingThreshold: 75, estimatedDays: '7-14 business days', isActive: true },
      { id: 'zone-04', name: 'North America', country: 'US/Canada', baseRate: 10.00, freeShippingThreshold: 75, estimatedDays: '7-14 business days', isActive: true },
      { id: 'zone-05', name: 'Worldwide Express', country: 'Global', baseRate: 25.00, freeShippingThreshold: null, estimatedDays: '3-5 business days', isActive: true },
    ];

    for (const z of zones) {
      await db.collection('deliveryZones').doc(z.id).set({
        ...z,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    console.log(`✅ ${zones.length} delivery zones seeded.`);

    // 7. Store Config Settings
    console.log('⚙️ Seeding store settings...');
    await db.collection('settings').doc('store_config').set({
      storeName: 'PURE GOLD Products',
      storeTagline: 'Ceylon Cinnamon — Pure Gold from Sri Lanka',
      contactEmail: 'info@puregoldcinnamon.com',
      contactPhone: '+94 77 123 4567',
      address: 'Mirissa / Galle, Southern Province, Sri Lanka',
      currency: 'USD',
      currencySymbol: '$',
      freeShippingThreshold: 50,
      flatShippingRate: 5,
      maintenanceMode: false,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ Store settings seeded.');

    console.log('\n🎉 Seed process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seed:', error);
    process.exit(1);
  }
};

seedDatabase();
