const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
let num = 1;

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '618a43ab1da32354475def7c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
                },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                      url: 'https://res.cloudinary.com/dtn1afc6l/image/upload/v1636641040/YelpCamp/seeds/hlcrbaa83kdh6tocf1ru.jpg',
                      filename: 'YelpCamp/hlcrbaa83kdh6tocf1ru',
                    },
                    {
                      url: 'https://res.cloudinary.com/dtn1afc6l/image/upload/v1636641042/YelpCamp/seeds/kgmjpkeqaxfabxqjco8r.jpg',
                      filename: 'YelpCamp/kgmjpkeqaxfabxqjco8r',
            }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})