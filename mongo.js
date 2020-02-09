const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url =
  `mongodb+srv://nixon:${password}@cluster0-kcv89.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model("number", phonebookSchema)

const number = new Number({
  name: newName,
  number: newNumber
})

if (newName && newNumber) {
  number.save().then(response => {
    console.log("number saved!",response)
    mongoose.connection.close()
  })
} else if (!newName && !newNumber) {
  Number.find({}).then(result => {
    result.forEach(number => {
      console.log(number)
    })
    mongoose.connection.close()
  })
} else {
  console.log("Seems that you did not give proper information. Give name AND number.")
  mongoose.connection.close()
}
