<script setup lang="ts">
interface Column {
  prop: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  type?: 'kbd';
}

withDefaults(
  defineProps<{
    data: any[];
    columns: Column[];
    wrapperClass?: string;
  }>(),
  {
    wrapperClass: '',
  },
);
</script>

<template>
  <div class="table-responsive" :class="wrapperClass">
    <el-table :data="data" class="table-bordered">
      <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width"
        :align="col.align">
        <template v-if="col.type === 'kbd'" #default="{ row }">
          <kbd class="kbd-key">{{ row[col.prop] }}</kbd>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
