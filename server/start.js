require('dotenv').config({path: './variables.env'});








const app = require("./app");
app.set('port', process.env.PORT);

const server = app.listen(app.get('port'), () => {
    console.log(`🚀 📱 💻 Launched server on localhost:${app.get('port')}`);
})