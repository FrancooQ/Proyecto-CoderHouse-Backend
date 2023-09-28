import { productModel } from "../models/product.js";

class ProductManager {
  //#Create
  async addProduct(product) {
    try {
      if (await this.validateCode(product.code)) {
        //si el codigo existe
        console.error(`Error: product code "${product.code}" already exists`);
        return false;
      } else {
        await productModel.create(product);
        console.log("Product added successfully!");
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //#Read
  async getProducts(limit = 10, page = 1, sort = '', query = {}) {
    
    try {
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? 'price' : sort === 'desc' ? '-price' : null,
      };
  
      let products = await productModel.paginate(query, options);
  
      const response = {
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage || null,
        nextPage: products.nextPage || null,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : null,
      };
  
      return response;
    } catch (error) {
      return {
        status: 'error',
        payload: error.message,
      };
    }
  }

  async getProductById(id) {
    if (this.validateId(id)) {
       return await productModel.findOne({_id:id}).lean() || null;
    } else {
      console.log("Not found!");

      return null;
    }
  }

  //#Update
  async updateProduct(id, product) {
    try {
      if (this.validateId(id)) {
        if (await this.getProductById(id)) {
          await productModel.updateOne({ _id: id }, product);
          console.log("Product updated!");
          return true;
        } else {
          console.error(`The product id: ${id} does not exist`);
          return false;
        }
      } else {
        console.error(`The id: ${id} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");

      return false;
    }
  }

  //#Delete
  async deleteProduct(id) {
    console.log(id);
    try {
      if (this.validateId(id)) {
        if (await this.getProductById(id)) {
          await productModel.deleteOne({ _id: id });
          console.log(`Product id: ${id} has been deleted`);

          return true;
        } else {
          console.error(`The product id: ${id} does not exist`);
          return false;
        }
      } else {
        console.error(`The id: ${id} is not a Mongo valid id`);
        return false;
      }
    } catch (error) {
      console.log("Not found!");
      return false;
    }
  }

  //#Auxiliares
  async validateCode(code) {
    return (await productModel.findOne({ code: code })) || false;
  }

  validateId(id) {
    return id.length === 24 ? true : false; // 24 es la cantidad de caracteres que tiene un id de mongo, entonces valido esto para saber si es un id de mongo o no
  }
}

export default ProductManager;