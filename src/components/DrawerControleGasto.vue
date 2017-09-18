<template>
  <v-app id="example-1" toolbar footer>
    <v-navigation-drawer persistent v-model="drawer" light   enable-resize-watcher absolute >
      <v-list >
        <v-list-tile v-for="item in items" :key="item.title" @click="selectedItem(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="indigo darken-4" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Toolbar</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <!--v-router-->
        <tab-pessoa v-show="items[0].show"></tab-pessoa>
        <tab-tipo-gasto v-show="items[1].show"></tab-tipo-gasto>
        <tab-gasto v-show="items[2].show"></tab-gasto>
      </v-container>
    </main>
    <v-footer class="indigo">
      <span class="white--text">© 2017</span>
    </v-footer>
  </v-app>
</template>
<script>
import TipoGasto from './TipoGasto';
import Gasto from './Gasto';
import PessoaForm from './PessoaForm';
  export default {
    components: {
      'tab-tipo-gasto': TipoGasto,
      'tab-gasto': Gasto,
      'tab-pessoa': PessoaForm
    },
    data () {
      return {
        drawer: true,
        right: null,
        actualItem: null,
        items: []
      }
    },
    methods: {
      showSelectedItem() {
        this.items.forEach(anItem=>{
            if (this.actualItem == anItem)
              anItem.show = true;
            else
              anItem.show = false;
        });
      },
      selectedItem(an_item) {
        this.actualItem = an_item;
        this.showSelectedItem();
      },
    },
    created: function () {
      this.items = [ { title: 'Logar ou registrar', icon: 'account_circle', show: true }, { title: 'Tipo de Gasto', icon: 'note_add', show: false },
        { title: 'Gasto', icon: 'money', show: false }];
      this.actualItem = this.items[0];
    }
  }
</script>
