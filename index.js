require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")
// `mongodb+srv://nixon:nixon_fs2020@cluster0-kcv89.mongodb.net/phonebook?retryWrites=true&w=majority`
app.use(express.static("build"))
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))

const Number = require("./models/phonebook")

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Teppo Testaaja",
    "number": "123-45678",
    "id": 2
  },
  {
    "name": "Niko Vihervuori",
    "number": "040 1940 740",
    "id": 3
  }
]

////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

// SHOW AMOUNT OF CONTACTS
app.get("/info", (req, res) => {
  //console.log(util.inspect(req)); // Will give you more details than console.log
  Number.find({}).then(result => {
    let myTime = new Date()
    let myUTCTime = myTime.toString()
    let html = "<p>Phonebook has info for " + result.length + " people</p>"
    html += "<p>" + myUTCTime + "</p>"
    res.send(html)

  })
  ////
})

// SHOW ALL
app.get("/api/persons", (req, res) => {
  //console.log(util.inspect(req)); // Will give you more details than console.log
  console.log(Number)
  Number.find({}).then(result => {
    res.json(result.map(number => number.toJSON()))
  })
})

// SHOW A CONTACT THAT IS MATCHING GIVEN ID
app.get("/api/persons/:id", (request, response, next) => {
  Number.findById(request.params.id).then(number => {
    if (number) {
      response.json(number.toJSON())
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

// DELETE A CONTACT BY ID
app.delete("/api/persons/:id", (request, response, next) => {
  Number.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const number = {
    name: body.name,
    number: body.number
  }

  console.log(number)

  Number.findByIdAndUpdate(request.params.id, number, { new: true })
    .then(updatedNumber => {
      response.json(updatedNumber.toJSON())
    })
    .catch(error => next(error))
})

// ADD NEW CONTACT
app.post("/api/persons", (request, response, next) => {
  const body = request.body
  console.log("BODY", body)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing"
    })
  }

  persons.map(function (person) {
    if (person.name === body.name) {
      return response.status(400).json({
        error: "Name already exists in the phonebook"
      })
    }
  })

  const number = new Number({
    name: body.name,
    number: body.number
  })

  number
    .save()
    .then(num => num.toJSON())
    .then(savedAndFormattedNum => {
      response.json(savedAndFormattedNum)
    })
    .catch(error => next(error))


})

/////////////////
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
/////////////////

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
