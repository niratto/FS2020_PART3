const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
//const util = require('util');
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

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


const generateId = () => {
    return Math.floor(Math.random() * 100000);
}

////////////////////////////////////////

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

// SHOW AMOUNT OF CONTACTS
app.get('/info', (req, res) => {
    let myTime = new Date();
    let myUTCTime = myTime.toString();
    let html = "<p>Phonebook has info for " + persons.length + " people</p>"
    html += "<p>" + myUTCTime + "</p>"
    res.send(html)
})

// SHOW ALL
app.get('/api/persons', (req, res) => {
    //console.log(util.inspect(req)); // Will give you more details than console.log
    res.json(persons)
})

// SHOW A CONTACT THAT IS MATCHING GIVEN ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)


    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// DELETE A CONTACT BY ID
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// ADD NEW CONTACT
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log("BODY", body)
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }

    persons.map(function (person) {
        if (person.name === body.name) {
            return response.status(400).json({
                error: 'Name already exists in the phonebook'
            })
        }
    })

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
