import mongoose from 'mongoose'

const configureDB = () => {
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log('connected to db');
    })
    .catch((err)=>{
        console.log('error conneceting to db',err);
    })
}

export default configureDB