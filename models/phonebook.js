const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)
const url = process.env.MONGODB_URI

console.log("connecting to", url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log("connected to MongoDB ", result.connections[0].NativeConnection)
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    unique: true,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
})

phonebookSchema.plugin(uniqueValidator)

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("number", phonebookSchema)