<template>
  <main class="my-8">
    <div>
      <h3 class="text-gray-700 text-2x1 font-medium">Wrist Watch</h3>
      <span class="mt-3 text-sm text-gray-500">200+ Products</span>
      <div
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 x1:grid-cols-4 mt-6"
      >
        <product-card v-for="product in products" :key="product.id" />
      </div>
    </div>
  </main>
</template>

<script>
import ProductCard from '@/components/ProductCard'
import products from '@/mocks/products.json'
export default {
  components: { ProductCard },
  computed: {
    products() {
      return products
    },
  },
}
</script>
