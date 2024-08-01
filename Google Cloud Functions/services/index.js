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

functions.http('listServices', async (req, res) => {
  try {
    // Fetch all documents from the Firestore collection
    const servicesSnapshot = await firestore.collection('BYSERVICES').get();
    if (servicesSnapshot.empty) {
      console.log('No matching documents.');
      res.status(404).send('No documents found.');
      return;
    }

    const services = servicesSnapshot.docs.map(doc => doc.data());
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).send('Internal Server Error');
  }
});