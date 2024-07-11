import createCategory from "./services/createCategory";
import createOrder from "./services/createOrder";
import createProduct from "./services/createProduct";
import pushTables from "./services/pushTables";


//  pushin tables on database 

const bootstrap = async () => {
await pushTables().then(()=>{
    console.log('tables successfully pushed')
})

//  create categories 

 await createCategory({ body: { categoryName: 'computers' } });

// create subcategory
await createCategory({ body: { categoryName: 'laptops' ,parentCategoryId : 1  } });

//  create product

await createProduct(
    {
        body: {
            productName: 'laptop',
            description: 'A high-performance laptop',
            price: 1000,
            categoryId: 2,
            quantity: 25
        }
    } 

);

//  create Order 

await createOrder({
    body: {
        orderDate: new Date(),
        orderItems: [
            { productId: 1, quantity: 5 },
        ]
    }
});

}

bootstrap()