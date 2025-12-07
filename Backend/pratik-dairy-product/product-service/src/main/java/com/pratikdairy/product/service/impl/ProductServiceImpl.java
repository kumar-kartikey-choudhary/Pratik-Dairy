package com.pratikdairy.product.service.impl;

import com.pratikdairy.parent.utility.MapperUtility;
import com.pratikdairy.product.dto.ProductDto;
import com.pratikdairy.product.model.Product;
import com.pratikdairy.product.repository.ProductRepository;
import com.pratikdairy.product.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public ProductDto create(ProductDto productDto , MultipartFile imageFile) {
        log.info("Inside @class ProductServiceImpl @method create @Param productDto : {}", productDto);
        if (productDto == null) {
            throw new RuntimeException("Product Object can not be null");
        }
        try {
            productDto.setId(null);
            log.info("Converting Dto to entity");
            Product product = MapperUtility.sourceToTarget(productDto, Product.class);
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageData(imageFile.getBytes());
            product = productRepository.saveAndFlush(product);
            log.info("Product saved to the db");

            return MapperUtility.sourceToTarget(product, ProductDto.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public ProductDto find(String id) {
        log.info("Inside @class ProductServiceImpl @method find @Param id :{}", id);
        if (id == null) {
            throw new IllegalCallerException("Product id can not be null");
        }
        try {
            Product product = this.productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
            if (product == null) {
                log.info("Can not find user by that id :{}", id);
            }
            return MapperUtility.sourceToTarget(product, ProductDto.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<ProductDto> findAll() {
        log.info("Inside @class ProductServiceImpl @method findAll");
        try {
            List<Product> all = this.productRepository.findAll();
            return all.stream().map(product -> {
                try {
                    return MapperUtility.sourceToTarget(product, ProductDto.class);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }).toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public ProductDto update(ProductDto productDto, String id) {
        log.info("Inside @class ProductServiceImpl @method update @Param id :{} , productDto :{}", id, productDto);
        if (id == null) {
            throw new RuntimeException("Id must not be null");
        }
        try {
            Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

            product.setPrice(productDto.getPrice());
            product.setAvailable(productDto.isAvailable());
            product.setStockUnit(productDto.getStockUnit());
            product.setStockQuantity(productDto.getStockQuantity());
            product.setManufactureDate(productDto.getManufactureDate());
            product.setExpiryDate(productDto.getExpiryDate());
            product.setExpiryDate(productDto.getExpiryDate());

            Product updated = productRepository.saveAndFlush(product);

            log.info("Product details updated..");
            return MapperUtility.sourceToTarget(updated, ProductDto.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


 @Override
    @Transactional
    public ProductDto update(ProductDto productDto, String id, MultipartFile imageFile) {
        log.info("Inside @class ProductServiceImpl @method update @Param id :{} , productDto :{} , imageFile :{}", id, productDto , imageFile);
        if (id == null) {
            throw new RuntimeException("Id must not be null");
        }
        try {
            Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

            product.setPrice(productDto.getPrice());
            product.setAvailable(productDto.isAvailable());
            product.setStockUnit(productDto.getStockUnit());
            product.setStockQuantity(productDto.getStockQuantity());
            product.setManufactureDate(productDto.getManufactureDate());
            product.setExpiryDate(productDto.getExpiryDate());

            if(!imageFile.isEmpty())
            {
                product.setImageName(imageFile.getOriginalFilename());
                product.setImageType(imageFile.getContentType());
                product.setImageData(imageFile.getBytes());
            }

            Product updated = productRepository.saveAndFlush(product);

            log.info("Product details updated ..");
            return MapperUtility.sourceToTarget(updated, ProductDto.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void delete(String id) {
        log.info("Inside @class ProductServiceImpl @method delete @Param id :{}", id);

        if (id == null) {
            log.warn("Product ID is null. Cannot delete user.");
            throw new IllegalArgumentException("Product ID cannot be null");
        }

        try {
            // Step 1: Check if user exists
            Optional<Product> existingUserOpt = productRepository.findById(id);
            if (existingUserOpt.isEmpty()) {
                log.warn("Product with id {} not found. Nothing to delete.", id);
                throw new EntityNotFoundException("Product not found with id: " + id);
            }

            // Step 2: Delete the user
            productRepository.deleteById(id);
            log.info("Product with id {} deleted successfully", id);

        } catch (Exception e) {
            log.error("Error while deleting product with id {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete product", e);
        }
    }

    @Override
    public List<ProductDto> searchProduct(String name) {
       log.info("Inside @class ProductServiceImpl @method searchProduct @Param name :{}", name);
       if(name == null || name.isEmpty())
       {
           this.findAll();
       }
        List<Product> products = this.productRepository.findByProductNameContainingIgnoreCase(name);

       return products.stream().map(product -> {
           try {
               return  MapperUtility.sourceToTarget(product, ProductDto.class);
           } catch (Exception e) {
               throw new RuntimeException("Product not mapped with its Dto", e);
           }
       }).toList();
    }
}
