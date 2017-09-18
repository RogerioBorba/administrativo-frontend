<template>
  <v-app>
    <main>
      <v-container fluid>
        <form>
          <template v-if="showRegistrar">
            <v-text-field  label="Nome" v-model="pessoa.nome" ></v-text-field>
          </template>
           <v-text-field  label="Nome do usuário" v-model="pessoa.nome_usuario" ></v-text-field>
           <template v-if="showRegistrar">
             <v-menu lazy  :close-on-content-click="true"  v-model="menu"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
               <v-text-field slot="activator" label="Data de nascimento" v-model="pessoa.data_nascimento" prepend-icon="event" readonly ></v-text-field>
               <v-date-picker v-model="pessoa.data_nascimento" no-title scrollable actions>
               </v-date-picker>
             </v-menu>
          </template>
          <v-flex xs8>
            <v-text-field name="input-10-2" label="Informe a senha" v-model="pessoa.senha" hint="No mínimo 8 caracteres"  min="8"  append-icon="visibility_off" type="password"  class="input-group--focused" ></v-text-field>
          </v-flex>
          <template v-if="showRegistrar">
            <v-flex xs8>
              <v-text-field name="input-10-2" label="Informe a senha novamente" v-model="pessoa.senha_novamente"  append-icon="visibility_off" type="password"  class="input-group--focused" ></v-text-field>
            </v-flex>
          </template >
          <v-checkbox label="Registre-se" v-model="showRegistrar" ></v-checkbox>
          <v-btn @click="loginOrRegister">Confirmar</v-btn>
          <v-btn @click="cancel">Cancelar</v-btn>
       </form>
      </v-container>
    </main>
    <v-footer></v-footer>
  </v-app>
</template>
<script>
import axios from 'axios';
import {config} from './config';
  export default {
    name: 'PessoaForm',
    data () {
        return {
          pessoa: { nome: null, nome_usuario: null, email: null, password: null, new_password: null, data_nascimento: null, senha: null, senha_novamente: null},
          showRegistrar: false,
          menu: false,
          modal: false,
        }
    },
    methods: {
      loginOrRegister() {
        let url = '';
        if (this.showRegistrar)
          url = 'usuario-list/registro/'
        else
          url = 'usuario-list/login/'
        axios.post(url, this.pessoa).then( response => {
            if (response.status == 201) {
              console.log(response.headers['content-location']);
              console.log(response.headers['x-access-token']);
              this.pessoa.id = this.idFromUrl(response.headers['content-location']);
              this.items.push(this.actualItem);
              this.clearFieldsForm();
              this.actualItem = this.newActualItem();
            }
            console.log(response.status);
          })
        .catch(error => {
          console.log(error);
        });
        console.log(this.showRegistrar);

      },
      cancel(){}
    }
  }
</script>
