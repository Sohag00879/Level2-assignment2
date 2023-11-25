import app from './app';
import config from './app/config';

import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect(config.database_url as string); //amra sure j ata string hobe tai as diye dici
    app.listen(config.port, () => {
      console.log(`Server is running is at : ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
