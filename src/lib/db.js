import mongoose from "mongoose";


async function connectDB(){
    try{
      await mongoose.connect('mongodb+srv://Education:education9580@cluster0.znwasga.mongodb.net/?retryWrites=true&w=majority');
      console.log('datagbase connected succuessfully')
        
    }catch(err){
        console.log(err.message);
        process.exit();
    }
}

export default connectDB;