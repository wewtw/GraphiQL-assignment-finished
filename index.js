var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  id: Int
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!, description: String ): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => restaurants[arg.id],//returns a restaurant object with the specified id.
  //restaurant: ({ id }) => restaurants[id - 1],//returns the select id not the array id.
  restaurants: () => restaurants,//returns an array of all restaurants.
  
  setrestaurant: ({ input }) => {//adds a new restaurant to the restaurants array with the name, email, and age provided in the input. 
  restaurants.push({ id: input.id,  name: input.name, description: input.description,});
    return input;
  },
  
  deleterestaurant: ({ id }) => {//handles the deleterestaurant mutation operation
    const ok = Boolean(restaurants[id]);//creates a boolean value named "ok" that is true if a restaurant with the specified id exists in the array.
    let delR = restaurants[id];//creates a variable delR that holds the restaurant object to be deleted
    restaurants = restaurants.filter((item) => item.id !== id);//filters out the restaurant with the specified id from the array and assigns the resulting array back to the restaurants variable.
    console.log(JSON.stringify(delR));//logs the details of the deleted restaurant 
    return { ok }; //shows whether the deletion was successful or not.
  },
  editrestaurant: ({ id, name, description }) => {
    if (!restaurants[id]) {// check whether a restaurant with this id exists in the restaurants array. If not, it throws an error indicating that the restaurant doesn't exist.
      throw new Error("this restaurant doesn't exist");
    }
    restaurants[id] = {
      ...restaurants[id],
      name: name || restaurants[id].name,
      description: description || restaurants[id].description,
      //updates the restaurant object with the specified id in the restaurants array by merging the existing restaurant object with the updated restaurant object, and assigns the updated object back to the restaurants array.
    };
    return restaurants;//returns the updated restaurant object!
  },
};

// Express server and map GraphQL API to /graphql endpoint
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
//start the server at 5500
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

// Export root resolver for use in other parts of the application
module.exports = root;

/* 
Once started go inside the GQL UI insert the code below to use the server side code functionality.

#restaurant: This gets a single restaurant based on a provided ID. 
#{
  #restaurant(id: 2) {
    #id
    #name
    #description
    #dishes {
      #name
      #price
    #}
  #}
#}

#restaurants: This gets a list of all restaurants. 
query restaurants{
  restaurants {
    id
    name
    description
    dishes {
      name
      price
    }
  }
}

#setrestaurant: This creates a new restaurant with id, name, description.

mutation setrestaurants {
  setrestaurant(input: { id: 3 name: "New restaurant3", description: "new des3", }) {
    id
    name
    description
  }
}

#Deleterestaurant: This deletes a restaurant based on the provided id.

mutation deleterestaurants{
  deleterestaurant(id: 4){
    ok
  }
}

#editrestaurant: This updates a restaurant based on the provided id.

mutation editRestaurants($id: Int!, $name: String!, $descriptions: String) {
  editrestaurant(id: $id, name: $name, description: $descriptions) {
    id
    name
    description
  }
}





*/
