import mongoose from 'mongoose';
import { config } from './config';
import User from './models/User';
import Item from './models/Item';
import Transaction from './models/Transaction';
import Message from './models/Message';

const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Connecting to MongoDB for database seeding...');
    await mongoose.connect(config.mongodbUri);
    console.log(`✅ Connected to MongoDB at: ${config.mongodbUri}\n`);

    // Wipe existing collections
    console.log('🧹 Purging existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Transaction.deleteMany({}),
      Message.deleteMany({}),
    ]);
    console.log('✅ Collections cleared.\n');

    // 1. Create 3 Realistic University Student Users
    console.log('👤 Seeding 3 verified student users...');
    const plainPassword = 'Password123!';

    const user1 = new User({
      name: 'Elena Rostova',
      email: 'elena.rostova@hhu.de',
      password: plainPassword,
      universityId: 'HHU-CS-88231',
      is_verified: true,
      verificationMethod: 'email_domain',
      communityScore: 4.9,
      totalItemsListed: 4,
      totalBorrows: 6,
      totalReturns: 6,
      totalSaved: 380,
    });

    const user2 = new User({
      name: 'Liam Chen',
      email: 'liam.chen@hhu.de',
      password: plainPassword,
      universityId: 'HHU-PH-64019',
      is_verified: true,
      verificationMethod: 'email_domain',
      communityScore: 4.8,
      totalItemsListed: 3,
      totalBorrows: 4,
      totalReturns: 4,
      totalSaved: 210,
    });

    const user3 = new User({
      name: 'Maya Patel',
      email: 'maya.patel@hhu.de',
      password: plainPassword,
      universityId: 'HHU-MED-71934',
      is_verified: true,
      verificationMethod: 'email_domain',
      communityScore: 5.0,
      totalItemsListed: 3,
      totalBorrows: 8,
      totalReturns: 8,
      totalSaved: 540,
    });

    await Promise.all([user1.save(), user2.save(), user3.save()]);
    console.log('✅ Created users:');
    console.log(`   - ${user1.name} (${user1.email}) [Score: ${user1.communityScore}]`);
    console.log(`   - ${user2.name} (${user2.email}) [Score: ${user2.communityScore}]`);
    console.log(`   - ${user3.name} (${user3.email}) [Score: ${user3.communityScore}]\n`);

    // 2. Create 10 Realistic Student Items
    console.log('📦 Seeding 10 categorized campus items...');
    const itemsData = [
      {
        title: 'TI-84 Plus CE Graphing Calculator',
        description:
          'Color backlit screen scientific graphing calculator with rechargeable lithium-ion battery. Preloaded with periodic table and statistics apps. Ideal for Linear Algebra, Calculus 2, and Physics exams.',
        category: 'Electronics' as const,
        ownerEmail: user1.email,
        owner: user1._id,
        maxBorrowTime: '3 days',
        status: 'available' as const,
        is_verified: true,
      },
      {
        title: 'Dell UltraSharp 27" 4K USB-C Monitor',
        description:
          'High-resolution IPS display with 90W USB-C power delivery, HDMI 2.0, and integrated USB hub. Ideal for working on your bachelor/master thesis, split-screen coding, or design projects.',
        category: 'Electronics' as const,
        ownerEmail: user2.email,
        owner: user2._id,
        maxBorrowTime: '1 week',
        status: 'available' as const,
        is_verified: true,
      },
      {
        title: 'Database System Concepts (7th Edition)',
        description:
          'Classic Silberschatz textbook covering relational algebra, SQL optimization, schema design, and concurrency controls. Includes lecture notes and chapter summaries.',
        category: 'Books' as const,
        ownerEmail: user1.email,
        owner: user1._id,
        maxBorrowTime: '2 weeks',
        status: 'available' as const,
        is_verified: true,
      },
      {
        title: 'iFixit Pro Tech Electronics Toolkit',
        description:
          'Precision driver kit equipped with 64 bits, ESD-safe tweezers, spudgers, Jimmy, opening picks, and suction handle. Perfect for laptop SSD/RAM upgrades, screen repairs, or battery swaps.',
        category: 'Tools' as const,
        ownerEmail: user2.email,
        owner: user2._id,
        maxBorrowTime: '2 days',
        status: 'available' as const,
        is_verified: true,
      },
      {
        title: 'Standard White Laboratory Coat (100% Cotton, Size M)',
        description:
          'Clean, flame-resistant 100% cotton lab coat meeting Heinrich Heine University biosafety and chemistry safety lab requirements. Freshly laundered with reinforced press-stud buttons.',
        category: 'Other' as const,
        ownerEmail: user3.email,
        owner: user3._id,
        maxBorrowTime: '5 days',
        status: 'available' as const,
        is_verified: true,
      },
      {
        title: 'Sony WH-1000XM4 Noise-Cancelling Headphones',
        description:
          'Industry-standard active noise cancelling over-ear headphones with 30-hour battery life and quick charge. Essential for intensive study sprints at the ULB campus library.',
        category: 'Electronics' as const,
        ownerEmail: user3.email,
        owner: user3._id,
        maxBorrowTime: '4 days',
        status: 'reserved' as const,
        is_verified: true,
      },
      {
        title: 'Campbell Biology (12th Edition Global)',
        description:
          'Comprehensive textbook for first-year pre-med, molecular biology, and biochemistry modules. Pristine condition with high-resolution full-color anatomy diagrams.',
        category: 'Books' as const,
        ownerEmail: user3.email,
        owner: user3._id,
        maxBorrowTime: '10 days',
        status: 'reserved' as const,
        is_verified: true,
      },
      {
        title: 'Yamaha P-45 88-Key Weighted Digital Piano',
        description:
          'Full-size Graded Hammer Standard (GHS) weighted action keyboard. Includes sustain pedal, collapsible dual-X stand, and headphone jack for quiet dormitory practice.',
        category: 'Musical Instruments' as const,
        ownerEmail: user1.email,
        owner: user1._id,
        maxBorrowTime: '1 week',
        status: 'reserved' as const,
        is_verified: true,
      },
      {
        title: 'Kryptonite Evolution Heavy-Duty D-Lock with Cable',
        description:
          'Sold Secure Gold rated 14mm hardened steel shackle with 4ft double-loop flex cable. Guaranteed security for locking your e-bike or bicycle on campus grounds.',
        category: 'Sports' as const,
        ownerEmail: user2.email,
        owner: user2._id,
        maxBorrowTime: '3 days',
        status: 'available' as const,
        is_verified: true,
      },
      {
        title: 'Anker 65W GaN Multi-Port USB-C Fast Charger',
        description:
          'Ultra-compact fast power brick with 2x USB-C ports (PowerIQ 3.0) and 1x USB-A port. Easily charges MacBook Air, iPad, and smartphone at high speed simultaneously.',
        category: 'Electronics' as const,
        ownerEmail: user1.email,
        owner: user1._id,
        maxBorrowTime: '1 week',
        status: 'available' as const,
        is_verified: true,
      },
    ];

    const seededItems = await Item.insertMany(itemsData);
    console.log(`✅ Successfully seeded ${seededItems.length} items:`);
    seededItems.forEach((item, idx) => {
      const tag = item.status === 'available' ? '🟢 Available' : '🟡 Reserved ';
      console.log(`   ${(idx + 1).toString().padStart(2, ' ')}. [${tag}] ${item.title} (${item.category})`);
    });
    console.log();

    // 3. Create Realistic Borrowing Transactions for Dashboard Activity Feeds
    console.log('🤝 Seeding initial active and completed borrowing transactions...');
    const reservedHeadphones = seededItems.find((i) => i.title.includes('Sony WH-1000XM4'))!;
    const reservedPiano = seededItems.find((i) => i.title.includes('Yamaha P-45'))!;

    const tx1 = new Transaction({
      item: reservedHeadphones._id,
      borrower: user2._id, // Liam borrowing from Maya
      lender: user3._id,
      status: 'approved',
      borrowDuration: '4 days',
      notes: 'Need for studying for the Optics & Photonics exam at the central library.',
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    });

    const tx2 = new Transaction({
      item: reservedPiano._id,
      borrower: user3._id, // Maya borrowing from Elena
      lender: user1._id,
      status: 'pending',
      borrowDuration: '1 week',
      notes: 'Practicing for student acoustic night at the campus cafe next Thursday.',
      requestedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    });

    await Promise.all([tx1.save(), tx2.save()]);
    console.log('✅ Seeded 2 active/pending transactions for dashboard interaction.\n');

    // 4. Create Direct Campus Messages
    console.log('💬 Seeding realistic campus coordination messages...');
    const msg1 = new Message({
      sender: user2._id,
      receiver: user3._id,
      transaction: tx1._id,
      content: 'Hey Maya! Thanks for approving the Sony headphones request. Can we meet near the Campus Cafeteria at 14:00?',
      read: true,
    });

    const msg2 = new Message({
      sender: user3._id,
      receiver: user2._id,
      transaction: tx1._id,
      content: 'Sounds perfect, Liam! I will bring the protective travel case and audio cable as well. See you there.',
      read: false,
    });

    await Promise.all([msg1.save(), msg2.save()]);
    console.log('✅ Seeded 2 messaging previews.\n');

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎉 CampusLend Database Seeding Complete!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🔑 Demo User Credentials:');
    console.log(`   1. ${user1.email}  |  Password: ${plainPassword}  (Elena - CS M.Sc.)`);
    console.log(`   2. ${user2.email}   |  Password: ${plainPassword}  (Liam - Physics B.Sc.)`);
    console.log(`   3. ${user3.email}   |  Password: ${plainPassword}  (Maya - Medicine)`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
