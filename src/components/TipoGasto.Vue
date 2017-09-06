<template>
<v-app>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar class="indigo text--lighten-2" dark>
          <v-btn icon @click="plusClicked">
             <v-icon >add</v-icon>
          </v-btn>
          <v-btn icon>
             <v-icon>search</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-text-field  :label="modeLabel" v-model="nome" @keyup.enter="updateOrCreateItem"></v-text-field>
        <v-list >
          <v-list-tile avatar v-for="(item, index) in items" :key="index" @click="" v-bind:value="item">
            <v-btn  purple lighten-4 icon @click.native="removeItem(item);">
               <v-icon dark> delete </v-icon>
            </v-btn>
            <v-btn  purple lighten-4 icon @click.native="editItem(item)" >
               <v-icon dark> edit </v-icon>
            </v-btn>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.nome" ></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</v-app>
</template>
<script>
import axios from 'axios';
export default {
  name: 'TipoGasto',
  data () {
      return {
        url: 'tipo-gasto-list/',
        items: [],
        nome: "",
        actualItem: {id: null, nome:''},
        modeLabel: ''
      }
    },
    methods: {

      idFromUrl(an_url) {
        return parseInt(an_url.split('/').reverse()[0]);
      },
      plusClicked() {
        this.nome = '';
        this.actualItem = {id: null, nome:''};
        this.modeLabel = 'Pressione enter para incluir um novo item';
      },
      updateOrCreateItem() {
        if (this.actualItem.id == null)
          return this.newItem();
        this.actualItem.nome = this.nome;
        axios.put(this.url + this.actualItem.id + "/", this.actualItem).then( response => {
            if (response.status == 204)
                this.nome = '';
        })
        .catch(error => {
          console.log(error);
        });
     },
      newItem() {
        if (this.nome == '')
          return;
        this.actualItem.nome = this.nome;
        axios.post(this.url, this.actualItem).then( response => {
            if (response.status == 201) {
              let i = {};
              i.id = this.idFromUrl(response.headers['content-location']);
              i.nome = this.nome;
              this.items.push(i);
              this.nome = '';
            }
          })
        .catch(error => {
          console.log(error);
        });
      },

      editItem(item) {
          this.modeLabel = 'Ao finalizar a edição, pressione enter para registrar a alteração';
          this.actualItem = item;
          this.nome = item.nome;
      },
      removeItem(item) {
        let index = this.items.indexOf(item);
        axios.delete(this.url + item.id + "/").then( response => {

        })
        .catch(error => {
          console.log(error);
        });
        if (index > -1) {
          this.items.splice(index, 1);
        }
      },
    },
    created: function () {
      axios.defaults.baseURL = 'http://127.0.0.1:8000/controle/';
      axios.defaults.headers.common['Accept'] = 'application/json';
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      this.url = "tipo-gasto-list/";
      this.dialog= false;
      this.modeLabel = 'Digite e pressione enter para incluir um novo item';
      axios.get(this.url).then(response => {
              this.items = response.data;

      })
      .catch(error => {
        console.log(error);
      });
    }
}
</script>
<style scoped>
color: black
</style>
