import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  
  private baseUrl= 'http://localhost:8080/api/products';

  private categoryUrl= 'http://localhost:8080/api/product-category';

  constructor(private httpClient:HttpClient) { }
 
  getProductListPaginate(thePage: number, 
                     thePageSize: number,
                     theCategoryId: number): Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`; 

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }  

  getProductList(theCategoryId: number): Observable<Product[]>{

    
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    
    return this.getProducts(searchUrl);
  }  

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    //map the Json based on category keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    //map the Json data from sping data rest to product array
    return this.getProducts(searchUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    
     //BUILD URL BASED ON  PRODUCT ID
     const productUrl = `${this.baseUrl}/${theProductId}`;
     
     return this.httpClient.get<Product>(productUrl);
  }

}

//_embeded is properties of the resource
interface GetResponseProducts {
 _embedded: {
  products: Product[];   
 };
 page: {
   //get the response meta data
   size: number,  
   totalElements: number,  
   totalPages: number,   
   number: number 
 } 
}

interface GetResponseProductCategory {
  _embedded: {
   productCategory: ProductCategory[];   
  } 
 }