<template>
  <v-app>
    <v-layout row>
      <v-flex sm12>
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
        <v-form v-model="valid" v-if="showCreateNewItem">
         <v-text-field  label="nome" v-model="name" :rules="nameRules"  :counter="10"  required  ></v-text-field>
         <v-text-field label="E-mail" v-model="email" :rules="emailRules" required ></v-text-field>
         <v-btn @click="submit">submit</v-btn>
         <v-btn @click="clear">clear</v-btn>
       </v-form>
        <v-data-table v-model="selected" v-bind:headers="headers" v-bind:items="items"  select-all v-bind:pagination.sync="pagination" selected-key="name" class="elevation-1">
          <template slot="headers" scope="props">
            <tr>
              <th>
                <v-checkbox primary hide-details @click.native="toggleAll" :input-value="props.all" :indeterminate="props.indeterminate"></v-checkbox>
              </th>
              <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                <v-icon>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox primary  hide-details :input-value="props.selected"></v-checkbox>
              </td>
              <td class="text-xs-right">{{ props.item.tipo_gasto }}</td>
              <td class="text-xs-right">{{ props.item.data }}</td>
              <td class="text-xs-right">{{ props.item.valor }}</td>
              <td class="text-xs-right">{{ props.item.usuario }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex >
    </v-layout>
  </v-app>
</template>
<script>
  import axios from 'axios';
  export default {
    name: 'Gasto',
    data () {
      return {
        pagination: {
         sortBy: 'valor'
       },
       selected: [],
       showCreateNewItem: false,
        headers: [

          { text: 'Tipo de gasto', value: 'tipo_de_gasto'},
          { text: 'Data', value: 'data' },
          { text: 'Valor', value: 'valor' },
          { text: 'Usuário', value: 'usuario' },

        ],
        items: [],
      }
    },
    methods: {
      toggleAll () {
        if (this.selected.length) this.selected = [];
        else this.selected = this.items.slice();
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      idFromUrl(an_url) {
        return parseInt(an_url.split('/').reverse()[0]);
      },
      plusClicked() {
        this.showCreateNewItem = true;
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
      this.url = "gasto-list/";
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
