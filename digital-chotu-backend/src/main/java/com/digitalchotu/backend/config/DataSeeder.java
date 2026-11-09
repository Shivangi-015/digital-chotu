package com.digitalchotu.backend.config;

import com.digitalchotu.backend.brand.entity.Brand;
import com.digitalchotu.backend.brand.repository.BrandRepository;
import com.digitalchotu.backend.category.entity.Category;
import com.digitalchotu.backend.category.repository.CategoryRepository;
import com.digitalchotu.backend.product.entity.Product;
import com.digitalchotu.backend.product.entity.ProductVariant;
import com.digitalchotu.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() > 0 || brandRepository.count() > 0 || productRepository.count() > 0) {
            return;
        }

        Map<String, Category> categories = seedCategories();
        Map<String, Brand> brands = seedBrands();
        seedProducts(categories, brands);
    }

    private Map<String, Category> seedCategories() {
        List<Category> categories = List.of(
                category("Groceries"),
                category("Dairy"),
                category("Snacks"),
                category("Beverages"),
                category("Personal Care"),
                category("Cooking Oil"),
                category("Bakery"),
                category("Spices & Condiments")
        );

        return categoryRepository.saveAll(categories)
                .stream()
                .collect(Collectors.toMap(Category::getName, Function.identity()));
    }

    private Map<String, Brand> seedBrands() {
        List<Brand> brands = List.of(
                brand("Aashirvaad"),
                brand("Amul"),
                brand("Britannia"),
                brand("Tata"),
                brand("Fortune"),
                brand("Parle"),
                brand("Maggi"),
                brand("Pillsbury"),
                brand("Mother Dairy"),
                brand("Nandini"),
                brand("Catch"),
                brand("Saffola"),
                brand("Dhara"),
                brand("Patanjali"),
                brand("Gemini"),
                brand("Sunfeast"),
                brand("Modern"),
                brand("Harvest Gold"),
                brand("Red Label"),
                brand("Society"),
                brand("Everest"),
                brand("Madhur"),
                brand("Dhampure"),
                brand("Colgate"),
                brand("Dove")
        );

        return brandRepository.saveAll(brands)
                .stream()
                .collect(Collectors.toMap(Brand::getName, Function.identity()));
    }

    private void seedProducts(Map<String, Category> categories, Map<String, Brand> brands) {
        productRepository.saveAll(List.of(

                // ---------- ATTA (price comparison set) ----------
                product(
                        "Aashirvaad Atta",
                        "Whole wheat flour for soft rotis and everyday cooking.",
                        categories.get("Groceries"),
                        brands.get("Aashirvaad"),
                        List.of(
                                variant("5 kg", "5", "kg", "275.00", 60),
                                variant("10 kg", "10", "kg", "520.00", 40)
                        )
                ),
                product(
                        "Pillsbury Chakki Fresh Atta",
                        "Whole wheat flour, stone-ground for soft rotis.",
                        categories.get("Groceries"),
                        brands.get("Pillsbury"),
                        List.of(
                                variant("5 kg", "5", "kg", "260.00", 55),
                                variant("10 kg", "10", "kg", "505.00", 30)
                        )
                ),
                product(
                        "Fortune Chakki Fresh Atta",
                        "Whole wheat flour with natural fibre for daily cooking.",
                        categories.get("Groceries"),
                        brands.get("Fortune"),
                        List.of(
                                variant("5 kg", "5", "kg", "265.00", 50),
                                variant("10 kg", "10", "kg", "515.00", 25)
                        )
                ),

                // ---------- MILK (price comparison set) ----------
                product(
                        "Amul Taaza Milk",
                        "Toned milk for tea, coffee, cereals, and daily use.",
                        categories.get("Dairy"),
                        brands.get("Amul"),
                        List.of(
                                variant("500 ml", "500", "ml", "28.00", 120),
                                variant("1 L", "1", "L", "56.00", 90)
                        )
                ),
                product(
                        "Mother Dairy Toned Milk",
                        "Toned milk suitable for daily household use.",
                        categories.get("Dairy"),
                        brands.get("Mother Dairy"),
                        List.of(
                                variant("500 ml", "500", "ml", "27.00", 100),
                                variant("1 L", "1", "L", "54.00", 70)
                        )
                ),
                product(
                        "Nandini Toned Milk",
                        "Toned milk, sourced from Karnataka dairy cooperatives.",
                        categories.get("Dairy"),
                        brands.get("Nandini"),
                        List.of(
                                variant("500 ml", "500", "ml", "26.00", 80),
                                variant("1 L", "1", "L", "52.00", 60)
                        )
                ),

                // ---------- SALT (price comparison set) ----------
                product(
                        "Tata Salt",
                        "Iodized salt for everyday cooking.",
                        categories.get("Groceries"),
                        brands.get("Tata"),
                        List.of(
                                variant("1 kg", "1", "kg", "28.00", 100)
                        )
                ),
                product(
                        "Aashirvaad Iodized Salt",
                        "Free-flowing iodized salt for daily cooking.",
                        categories.get("Groceries"),
                        brands.get("Aashirvaad"),
                        List.of(
                                variant("1 kg", "1", "kg", "27.00", 90)
                        )
                ),
                product(
                        "Catch Iodized Salt",
                        "Vacuum-evaporated iodized salt for everyday use.",
                        categories.get("Groceries"),
                        brands.get("Catch"),
                        List.of(
                                variant("1 kg", "1", "kg", "26.00", 75)
                        )
                ),

                // ---------- COOKING OIL (price comparison + diabetes recommendation set) ----------
                product(
                        "Fortune Sunflower Oil",
                        "Refined sunflower oil for everyday cooking. Moderate PUFA content; not specifically formulated for diabetic or cardiac diets.",
                        categories.get("Cooking Oil"),
                        brands.get("Fortune"),
                        List.of(
                                variant("1 L", "1", "L", "145.00", 70),
                                variant("5 L", "5", "L", "710.00", 35)
                        )
                ),
                product(
                        "Saffola Gold Blended Oil",
                        "Blend of rice bran and sunflower oil. Low glycemic index and low saturated fat, widely recommended by dietitians for diabetics and heart patients.",
                        categories.get("Cooking Oil"),
                        brands.get("Saffola"),
                        List.of(
                                variant("1 L", "1", "L", "180.00", 65),
                                variant("5 L", "5", "L", "875.00", 20)
                        )
                ),
                product(
                        "Dhara Mustard Oil",
                        "Cold-pressed mustard oil rich in monounsaturated fats. Good heart-healthy alternative, suitable in moderation for diabetics.",
                        categories.get("Cooking Oil"),
                        brands.get("Dhara"),
                        List.of(
                                variant("1 L", "1", "L", "165.00", 55),
                                variant("5 L", "5", "L", "800.00", 18)
                        )
                ),
                product(
                        "Patanjali Groundnut Oil",
                        "Refined groundnut oil for everyday cooking. Moderate saturated fat; not specifically recommended for diabetic diets.",
                        categories.get("Cooking Oil"),
                        brands.get("Patanjali"),
                        List.of(
                                variant("1 L", "1", "L", "175.00", 40)
                        )
                ),
                product(
                        "Gemini Refined Sunflower Oil",
                        "Refined sunflower oil, high in polyunsaturated fat but degrades on repeated heating. Not ideal for diabetic or cardiac diets compared to blended oils.",
                        categories.get("Cooking Oil"),
                        brands.get("Gemini"),
                        List.of(
                                variant("1 L", "1", "L", "150.00", 45),
                                variant("5 L", "5", "L", "730.00", 15)
                        )
                ),

                // ---------- TEA (price comparison + chai ingredient) ----------
                product(
                        "Tata Tea Premium",
                        "Black tea blend for strong Indian chai.",
                        categories.get("Beverages"),
                        brands.get("Tata"),
                        List.of(
                                variant("250 g", "250", "g", "135.00", 65),
                                variant("1 kg", "1", "kg", "520.00", 30)
                        )
                ),
                product(
                        "Red Label Tea",
                        "Strong CTC black tea for everyday chai.",
                        categories.get("Beverages"),
                        brands.get("Red Label"),
                        List.of(
                                variant("250 g", "250", "g", "128.00", 60),
                                variant("1 kg", "1", "kg", "500.00", 25)
                        )
                ),
                product(
                        "Society Tea",
                        "Premium CTC tea leaves for a rich, aromatic chai.",
                        categories.get("Beverages"),
                        brands.get("Society"),
                        List.of(
                                variant("250 g", "250", "g", "140.00", 50)
                        )
                ),

                // ---------- SNACKS ----------
                product(
                        "Maggi 2 Minute Noodles",
                        "Instant masala noodles for quick snacks.",
                        categories.get("Snacks"),
                        brands.get("Maggi"),
                        List.of(
                                variant("70 g", "70", "g", "14.00", 150),
                                variant("Pack of 12", "840", "g", "168.00", 45)
                        )
                ),

                // ---------- BISCUITS (price comparison set) ----------
                product(
                        "Parle G Biscuits",
                        "Glucose biscuits for tea-time snacking.",
                        categories.get("Snacks"),
                        brands.get("Parle"),
                        List.of(
                                variant("Small Pack", "60", "g", "10.00", 200),
                                variant("Family Pack", "250", "g", "45.00", 80)
                        )
                ),
                product(
                        "Britannia Marie Gold Biscuits",
                        "Light and crispy biscuits, great with tea.",
                        categories.get("Snacks"),
                        brands.get("Britannia"),
                        List.of(
                                variant("Small Pack", "70", "g", "12.00", 180),
                                variant("Family Pack", "250", "g", "48.00", 70)
                        )
                ),
                product(
                        "Sunfeast Dark Fantasy Choco Fills",
                        "Chocolate cream-filled cookies for indulgent snacking.",
                        categories.get("Snacks"),
                        brands.get("Sunfeast"),
                        List.of(
                                variant("75 g", "75", "g", "40.00", 90),
                                variant("300 g", "300", "g", "150.00", 40)
                        )
                ),

                // ---------- BREAD (price comparison set) ----------
                product(
                        "Britannia Brown Bread",
                        "Soft brown bread for sandwiches and breakfast.",
                        categories.get("Bakery"),
                        brands.get("Britannia"),
                        List.of(
                                variant("400 g", "400", "g", "50.00", 55)
                        )
                ),
                product(
                        "Modern White Bread",
                        "Soft white sandwich bread for daily breakfast.",
                        categories.get("Bakery"),
                        brands.get("Modern"),
                        List.of(
                                variant("400 g", "400", "g", "45.00", 60)
                        )
                ),
                product(
                        "Harvest Gold Multigrain Bread",
                        "Multigrain bread made with a blend of healthy grains.",
                        categories.get("Bakery"),
                        brands.get("Harvest Gold"),
                        List.of(
                                variant("400 g", "400", "g", "55.00", 45)
                        )
                ),

                // ---------- DAIRY (misc) ----------
                product(
                        "Amul Butter",
                        "Pasteurized table butter for bread, cooking, and baking.",
                        categories.get("Dairy"),
                        brands.get("Amul"),
                        List.of(
                                variant("100 g", "100", "g", "58.00", 85),
                                variant("500 g", "500", "g", "275.00", 40)
                        )
                ),
                product(
                        "Britannia Cheese Slices",
                        "Processed cheese slices for sandwiches and burgers.",
                        categories.get("Dairy"),
                        brands.get("Britannia"),
                        List.of(
                                variant("10 slices", "200", "g", "150.00", 50)
                        )
                ),
                product(
                        "Amul Fresh Cream",
                        "Fresh dairy cream for desserts, curries, and beverages.",
                        categories.get("Dairy"),
                        brands.get("Amul"),
                        List.of(
                                variant("200 ml", "200", "ml", "65.00", 40)
                        )
                ),

                // ---------- SUGAR (chai ingredient, price comparison) ----------
                product(
                        "Madhur Sugar",
                        "Refined white sugar for everyday use, including tea.",
                        categories.get("Groceries"),
                        brands.get("Madhur"),
                        List.of(
                                variant("1 kg", "1", "kg", "45.00", 100)
                        )
                ),
                product(
                        "Dhampure Sugar",
                        "Refined white sugar suitable for tea and cooking.",
                        categories.get("Groceries"),
                        brands.get("Dhampure"),
                        List.of(
                                variant("1 kg", "1", "kg", "44.00", 90)
                        )
                ),

                // ---------- SPICES & CONDIMENTS (chai ingredients) ----------
                product(
                        "Fresh Ginger (Adrak)",
                        "Fresh ginger root, commonly used in chai for flavor and warmth.",
                        categories.get("Spices & Condiments"),
                        brands.get("Aashirvaad"),
                        List.of(
                                variant("100 g", "100", "g", "15.00", 60)
                        )
                ),
                product(
                        "Green Cardamom (Elaichi)",
                        "Aromatic green cardamom pods used to flavor chai.",
                        categories.get("Spices & Condiments"),
                        brands.get("Everest"),
                        List.of(
                                variant("50 g", "50", "g", "90.00", 45)
                        )
                ),
                product(
                        "Everest Chai Masala",
                        "Blended spice mix for making authentic masala chai.",
                        categories.get("Spices & Condiments"),
                        brands.get("Everest"),
                        List.of(
                                variant("100 g", "100", "g", "70.00", 55)
                        )
                ),

                // ---------- PERSONAL CARE ----------
                product(
                        "Colgate Strong Teeth Toothpaste",
                        "Cavity protection toothpaste for daily oral care.",
                        categories.get("Personal Care"),
                        brands.get("Colgate"),
                        List.of(
                                variant("100 g", "100", "g", "55.00", 70),
                                variant("200 g", "200", "g", "105.00", 40)
                        )
                ),
                product(
                        "Dove Moisturizing Soap",
                        "Moisturizing beauty bar for soft, smooth skin.",
                        categories.get("Personal Care"),
                        brands.get("Dove"),
                        List.of(
                                variant("100 g", "100", "g", "48.00", 65)
                        )
                )
        ));
    }

    private Category category(String name) {
        return Category.builder()
                .name(name)
                .build();
    }

    private Brand brand(String name) {
        return Brand.builder()
                .name(name)
                .build();
    }

    private Product product(
            String name,
            String description,
            Category category,
            Brand brand,
            List<ProductVariant> variants
    ) {
        Product product = Product.builder()
                .name(name)
                .description(description)
                .category(category)
                .brand(brand)
                .build();

        variants.forEach(product::addVariant);

        return product;
    }

    private ProductVariant variant(
            String variantName,
            String weight,
            String unit,
            String price,
            int stockQuantity
    ) {
        return ProductVariant.builder()
                .variantName(variantName)
                .weight(new BigDecimal(weight))
                .unit(unit)
                .price(new BigDecimal(price))
                .stockQuantity(stockQuantity)
                .build();
    }
}