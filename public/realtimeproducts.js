const socket = io();
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
let productosActualizados=[];

socket.on('productos', productos =>{
    this.productosActualizados=productos;
    console.log("Se recibieron los productos")
    productList.innerHTML = '';
    productos.forEach(prod => addProduct(prod));
    
})


productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;

    const newProduct = { id: Date.now().toString(), title, price };

    socket.emit('newProduct', newProduct);


    productForm.reset();
});

 socket.on('newProduct', newProduct =>{
    const productos=productosActualizados  
    productos.push(newProduct)
    socket.emit('productos', productos)
})


    function addProduct(prod) {
    const li = document.createElement('li');
    li.innerHTML = `${prod.title} - $${prod.price} 
        <button onclick="deleteProduct('${prod.id}')">Eliminar</button>`;
    productList.appendChild(li);
}



function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}
