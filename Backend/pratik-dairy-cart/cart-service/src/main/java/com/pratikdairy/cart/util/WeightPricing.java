package com.pratikdairy.cart.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

/**
 * Product.price in the DB is always stored as the price for 1kg.
 * Smaller weight variants are derived by dividing the 1kg price down:
 * 250g = price / 4, 500g = price / 2, 1kg = price / 1.
 * This class does that conversion, so cart/order totals are always
 * computed on the server — never trusted from the client.
 *
 * NOTE: if you sell items where 500g/1kg are NOT simple fractions of 1kg
 * (e.g. bulk discounts), replace this with a real per-variant price table
 * on the Product entity instead of a divisor.
 */
//public final class WeightPricing {
//
//    private static final Map<String, BigDecimal> WEIGHT_DIVISORS = Map.of(
//            "250g", BigDecimal.valueOf(4),
//            "500g", BigDecimal.valueOf(2),
//            "1kg", BigDecimal.valueOf(1)
//    );
//
//    private WeightPricing() {}
//
//    public static BigDecimal divisorForWeight(String weight) {
//        if (weight == null) {
//            return BigDecimal.ONE;
//        }
//        return WEIGHT_DIVISORS.getOrDefault(weight.trim().toLowerCase(), BigDecimal.ONE);
//    }
//
//    public static BigDecimal priceForWeight(BigDecimal basePricePerKg, String weight) {
//        if (basePricePerKg == null) {
//            return BigDecimal.ZERO;
//        }
//        return basePricePerKg.divide(divisorForWeight(weight), 2, RoundingMode.HALF_UP);
//    }
//
//    public static boolean isValidWeight(String weight) {
//        return weight != null && WEIGHT_DIVISORS.containsKey(weight.trim().toLowerCase());
//    }
//
//
//}


/**
 * IMPORTANT: Product.price is stored against WHATEVER unit that product's
 * admin set in Product.stockUnit (could be "250g" for one product, "1kg" for
 * another, e.g. Buffalo Ghee is priced per "1kg"). It is NOT always 250g.
 *
 * So the multiplier is always computed RELATIVE to that product's own
 * stockUnit, converting both sides to grams:
 *
 *   priceForSelectedWeight = product.price * (selectedWeightInGrams / stockUnitInGrams)
 *
 * This is always computed on the server — never trusted from the client.
 *
 * NOTE: if a product's stockUnit is not a weight (e.g. "1 litre", "6 pcs"),
 * grams conversion is impossible — in that case weight-pill selection doesn't
 * make sense for that product and the UI should not show pills for it.
 */
public final class WeightPricing {

    private static final Set<String> SELECTABLE_WEIGHTS = Set.of("250g", "500g", "1kg");

    private WeightPricing() {}

    /** Converts a weight/unit string like "250g", "500 g", "1kg", "1 Kg" into grams. Returns -1 if not parseable as a weight. */
    private static double toGrams(String unit) {
        if (unit == null) return -1;
        String u = unit.trim().toLowerCase().replaceAll("\\s+", "");
        try {
            if (u.endsWith("kg")) {
                return Double.parseDouble(u.substring(0, u.length() - 2)) * 1000;
            }
            if (u.endsWith("gms")) {
                return Double.parseDouble(u.substring(0, u.length() - 3));
            }
            if (u.endsWith("g")) {
                return Double.parseDouble(u.substring(0, u.length() - 1));
            }
        } catch (NumberFormatException e) {
            return -1;
        }
        return -1; // not a weight unit (e.g. "litre", "pcs")
    }

    /**
     * Multiplier of selectedWeight relative to the product's own base unit.
     * Falls back to 1 (no change) if either side isn't a parseable weight —
     * e.g. product sold in litres/pieces, where weight-variant pricing doesn't apply.
     */
    public static BigDecimal multiplierFor(String selectedWeight, String productBaseUnit) {
        double selectedGrams = toGrams(selectedWeight);
        double baseGrams = toGrams(productBaseUnit);
        if (selectedGrams <= 0 || baseGrams <= 0) {
            return BigDecimal.ONE;
        }
        return BigDecimal.valueOf(selectedGrams)
                .divide(BigDecimal.valueOf(baseGrams), 4, RoundingMode.HALF_UP);
    }

    public static BigDecimal priceFor(BigDecimal basePrice, String selectedWeight, String productBaseUnit) {
        if (basePrice == null) {
            return BigDecimal.ZERO;
        }
        return basePrice.multiply(multiplierFor(selectedWeight, productBaseUnit))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public static boolean isValidWeight(String weight) {
        return weight != null && SELECTABLE_WEIGHTS.contains(weight.trim().toLowerCase());
    }

    /** True only if this product's stockUnit can actually be weight-converted (grams/kg). */
    public static boolean supportsWeightVariants(String productBaseUnit) {
        return toGrams(productBaseUnit) > 0;
    }
}