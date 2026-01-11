<script lang="ts">
export default {
  name: 'TipsInfoWindow',
  data() {
    return {
      gameParametersStore: useGameParametersStore(),
      scenarioStore: useScenarioStore(),
    }
  },
  computed: {
    language() {
      return this.gameParametersStore.language
    },
    title() {
      return this.language === 'fr' ? 'Conseils' : 'Tips'
    },
    closeLabel() {
      return this.language === 'fr' ? 'Fermer' : 'Close'
    },
    tipsText() {
      return this.language === 'fr'
          ? [
            "Commencez par lire la description du scénario : elle indique les moments clés (matin, midi, soir, nuit) où l’activité est la plus forte.",
            "Observez la courbe de production avant d’agir : repérez les périodes où la production est haute et celles où elle est faible.",
            "Évitez les “pics” : si plusieurs équipements peuvent être décalés, essayez de ne pas les faire fonctionner en même temps.",
            "Déplacez les consommations par petites étapes (15–30 min) et observez l’effet : vous comprendrez plus vite ce qui améliore la situation.",
            "Commencez par les équipements les plus énergivores : ce sont eux qui font le plus varier la consommation totale.",
            "Gardez en tête les usages “incompressibles” (ex : frigo, box internet) et concentrez-vous sur ce qui est déplaçable.",
            "Testez plusieurs stratégies : regrouper certaines consommations ou au contraire les étaler peut changer fortement le résultat.",
            "Si une période dépasse la production, cherchez l’appareil déclencheur et essayez d’en décaler un seul : parfois un petit changement suffit.",
            "Respectez les contraintes implicites du scénario (heures de présence, repas, douches, sommeil) : le but est d’optimiser sans rendre la journée irréaliste.",
            "Quand vous ajustez un horaire, vérifiez que vous n’avez pas créé un nouveau pic ailleurs : l’objectif est un équilibre global.",
            "Utilisez la liste des objets à placer (si elle existe) comme guide : elle indique ce qui doit être pris en compte pour ce scénario.",
            "Comparez vos essais : relancer une partie avec une approche différente aide à comprendre les mécanismes du jeu.",
            "Si vous êtes bloqué, revenez à une organisation simple : d’abord réduire les pics, ensuite affiner les détails.",
            "Pensez “routine” : dans beaucoup de scénarios, les pics reviennent toujours aux mêmes moments (matin/soir). Cherchez à les lisser.",
            "N’hésitez pas à supprimer et replacer un objet plutôt que de tout modifier : c’est souvent plus rapide pour tester une idée."
          ]
          : [
            "Start by reading the scenario description: it highlights key moments (morning, midday, evening, night) when activity is highest.",
            "Look at the production curve before making changes: identify periods of high and low production.",
            "Avoid “peaks”: if several appliances can be shifted, try not to run them at the same time.",
            "Move consumptions in small steps (15–30 min) and observe the impact: you will understand faster what improves the balance.",
            "Start with the most energy-intensive appliances: they affect total consumption the most.",
            "Keep “non-flexible” uses in mind (e.g., fridge, internet router) and focus on what can actually be shifted.",
            "Try different strategies: grouping some consumptions or spreading them out can significantly change the outcome.",
            "If consumption exceeds production during a period, identify the appliance causing it and shift just one item first—small changes can be enough.",
            "Respect the scenario’s implicit constraints (presence at home, meals, showers, sleep): optimize without making the day unrealistic.",
            "After adjusting a time slot, check that you didn’t create a new peak elsewhere: the goal is a global balance.",
            "Use the required items list (if available) as a guide: it shows what must be taken into account for that scenario.",
            "Compare your attempts: replaying with a different approach helps you understand the game mechanics.",
            "If you get stuck, return to a simple plan: reduce peaks first, then refine details.",
            "Think in terms of routines: in many scenarios, peaks happen at the same times (morning/evening). Try smoothing them out.",
            "Don’t hesitate to delete and place an object again rather than tweaking everything—it’s often faster to test an idea."
          ]
    },
  },
  methods: {
    close() {
      this.gameParametersStore.showTipsOverlay()
    },
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="scenario-modal-backdrop" @click="close"></div>

    <div class="scenario-modal popup-window">
      <div class="card" @click.stop>
        <div class="color-banner" style="background-color: #00737D;" />

        <div class="text">
          <h1 class="title">{{ title }}</h1>

          <ul>
            <li v-for="(t, i) in tipsText" :key="i">
              {{ t }}
            </li>
          </ul>
        </div>

        <div class="btn-container">
          <button class="btn-close" type="button" @click="close">
            {{ closeLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@import '../styles/components/ScenarioInfoWindow.scss';
</style>
