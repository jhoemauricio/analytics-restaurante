// Importa a função initFlowbite, responsável por inicializar os componentes JS do Flowbite (dropdowns, modais, tooltips, etc.)
import { initFlowbite } from 'flowbite';

// Cria um plugin Nuxt que será carregado automaticamente
export default defineNuxtPlugin((nuxtApp) => {
    // Adiciona um mixin global ao Vue (afeta todos os componentes da aplicação)
    nuxtApp.vueApp.mixin({
        // O hook mounted é executado sempre que um componente é montado no DOM
        mounted () {
             // Inicializa os componentes do Flowbite presentes na página
            // Isso garante que dropdowns, modais e outros elementos funcionem corretamente
            initFlowbite();
        }
    });
});