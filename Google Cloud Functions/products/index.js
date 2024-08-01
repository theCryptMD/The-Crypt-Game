const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore with a specific project ID and enable ignoreUndefinedProperties
let firestore;
try {
  firestore = new Firestore({
    projectId: 'biocryptricks', // Replace with your Firebase project ID
    ignoreUndefinedProperties: true,
  });
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firestore:', error);
}

functions.http('listProducts', async (req, res) => {
  try {
    // Fetch all documents from the Firestore collection
    const productsSnapshot = await firestore.collection('BYPRODUCT').get();
    if (productsSnapshot.empty) {
      console.log('No matching products found.');
      res.status(404).send('No products found.');
      return;
    }

    const products = productsSnapshot.docs.map(doc => doc.data());
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});