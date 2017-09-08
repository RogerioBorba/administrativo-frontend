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

        <form  v-if="showCreateOrUpdateItem">
           <v-text-field  label="Nome" v-model="actualItem.nome" ></v-text-field>
           <v-select label="Tipo de Gasto Genérico" v-model="actualItem.tipo_gasto_generico_object" :items="tipo_gasto_list" item-text="nome" ></v-select>
           <v-btn @click="updateOrCreateItem">submit</v-btn>
           <v-btn @click="cancel">Cancel</v-btn>
       </form>
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
        item: '',

        items: [],
        nome: "",
        tipo_gasto_generico_iri: '',
        tipo_gasto_generico: null,
        tipo_gasto_list: [],
        actualItem: {id: null, nome: '', tipo_gasto_generico: null, tipo_gasto_generico_object: null},
        showCreateOrUpdateItem: false
      }
    },
    methods: {
      changeItem(actuala) {
        console.log(actuala);
      },
      clearFieldsForm() {
        this.nome = '';
        this.tipo_gasto_generico = null;
      },
      lastCharIsBar(an_url) {

        if (an_url != null )
          return an_url.slice(-1) == '/';

        return false;
      },
      idFromUrl(an_url) {
        if (an_url == null)
          return -1;
        //console.log(an_url.slice(-1) == '/');
        let i =  this.lastCharIsBar(an_url) ? 1:0;
        return parseInt(an_url.split('/').reverse()[i]);
      },
      get_tipo_gasto_generico_object()  {
        let genericItem = null;
        if (this.actualItem.tipo_gasto_generico == null)
          return null;
        let newid = this.idFromUrl(this.actualItem.tipo_gasto_generico);
        this.items.forEach(function(anItem){
            if (anItem.id == newid) {
                genericItem = anItem;
                return;
            }

        });
        return genericItem;
      },
      plusClicked() {
        this.showCreateOrUpdateItem = true;
        this.actualItem = {id: null, nome: '', tipo_gasto_generico: null };
      },
      cancel() {
        this.showCreateOrUpdateItem = false;
        this.actualItem = {id: null, nome: '', tipo_gasto_generico: null };
      },
      updateOrCreateItem() {
        if (this.actualItem.id != null)
          return this.updateItem();
        this.createItem();
     },
     newActualItem() {
        return {id: null, nome: '', tipo_gasto_generico: null, tipo_gasto_generico_object: null};
     },
      createItem() {
        axios.post(this.url, this.actualItem).then( response => {
            if (response.status == 201) {
              this.actualItem.id = this.idFromUrl(response.headers['content-location']);
              this.items.push(this.actualItem);
              this.clearFields();
              this.actualItem = this.newActualItem();
            }
          })
        .catch(error => {
          console.log(error);
        });
      },
      updateItem() {
        if (this.actualItem.tipo_gasto_generico == null)
          return;
        return  console.log(this.actualItem.tipo_gasto_generico);
        axios.put(this.url + this.actualItem.id + "/", this.actualItem).then( response => {
            if (response.status == 204)
                this.clearFields();
        })
        .catch(error => {
          console.log(error);
        });
      },
      editItem(item) {
          this.actualItem = item;
          this.showCreateOrUpdateItem = true;
          this.actualItem.tipo_gasto_generico_object = this.get_tipo_gasto_generico_object();
          //console.log("this.actualItem.tipo_gasto_generico_object:");
          //console.log(this.get_tipo_gasto_generico_object());
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
      this.url = "tipo-gasto-list/";
      axios.get(this.url).then(response => {
              this.items = response.data;
              this.tipo_gasto_list = this.items;

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
