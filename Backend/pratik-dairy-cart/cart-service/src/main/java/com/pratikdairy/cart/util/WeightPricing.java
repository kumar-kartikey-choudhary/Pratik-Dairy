package com.pratikdairy.cart.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Set;

public final class WeightPricing {

    private static final Set<String> SELECTABLE_WEIGHTS = Set.of("250g", "500g", "1kg");

    private WeightPricing() {}

    public static double toGrams(String unit) {
        if (unit == null || unit.isBlank()) {
            return 1000.0; // Default to 1kg if blank
        }

        String u = unit.trim().toLowerCase().replaceAll("\\s+", "");

        // Fix for database having just "kg" or "g" without numbers
        if (u.equals("kg")) return 1000.0;
        if (u.equals("g") || u.equals("gms")) return 1.0;

        try {
            if (u.endsWith("kg")) {
                return Double.parseDouble(u.substring(0, u.length() - 2)) * 1000.0;
            }
            if (u.endsWith("gms")) {
                return Double.parseDouble(u.substring(0, u.length() - 3));
            }
            if (u.endsWith("g")) {
                return Double.parseDouble(u.substring(0, u.length() - 1));
            }
        } catch (NumberFormatException e) {
            return 1000.0; // Fallback to 1kg base if parsing fails
        }
        return 1000.0;
    }

    public static BigDecimal multiplierFor(String selectedWeight, String productBaseUnit) {
        double selectedGrams = toGrams(selectedWeight);
        double baseGrams = (productBaseUnit != null && !productBaseUnit.isBlank()) ? toGrams(productBaseUnit) : 1000.0;

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
        BigDecimal multiplier = multiplierFor(selectedWeight, productBaseUnit);
        return basePrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal stockToConsume(String selectedWeight, String productBaseUnit, int quantity) {
        return multiplierFor(selectedWeight, productBaseUnit).multiply(BigDecimal.valueOf(quantity));
    }
}