export function getAllData(req, res) {


    res.status(200).json({
        message: "Data Send",
        data: 
            [{
                name: "Sankar",
                age: 21,
                gender: "Male"
            },
            {
                name: "Sachhin",
                age: 22,
                gender: "Male"
            },
            {
                name: "Kavi",
                age: 20,
                gender: "Female"
            }
            ]
    }
    )
}