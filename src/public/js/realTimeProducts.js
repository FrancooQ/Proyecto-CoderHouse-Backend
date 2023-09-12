const socket = io();
const srvResponse = document.getElementById("srvResponse");
const btnAddProduct = document.getElementById("btnAddProduct");
const btnDeleteProduct = document.getElementById("btnDeleteProduct");

///Para mostrar productos cargados.
socket.on("realTimeProducts", (data) => {
  let html = `<table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Title</th>
                  <th scope="col">Image</th>
                  <th scope="col">Description</th>
                  <th scope="col">Price</th>
                  <th scope="col">Code</th>
                </tr>
              </thead>
              <tbody id="products">`;

  //Muestro productos cargados.
  data.forEach((prod) => {
    html += `<tr>
              <td>${prod._id}</td>
              <td>${prod.title}</td>
              <td><img src="${prod.thumbnails}" alt="" width="100px" /></td>
              <td>${prod.description}</td>
              <td>$ ${prod.price}</td>
              <td> ${prod.code}</td>
            </tr>`;
  });
  html += `</tbody></table>`;
  srvResponse.innerHTML = html;
});

let currentCode = 1;

const addProduct = () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = currentCode++;
  const product = {
    title: title,
    description: description,
    price: price,
    code: code,
  };
  socket.emit("newProduct", product);
};

btnAddProduct.onclick = addProduct;

const deleteProduct = () => {
  const inputElement = document.getElementById("inputDeleteId");
  const id = inputElement.value;
  socket.emit("deleteProduct", id);
};

btnDeleteProduct.onclick = deleteProduct;