<template>
  <div>
    <!--
    TODO:
    1. rename class names
    9. change status classes from one, two, three to smth more meaningful
    2. Divide into components
    3. remove buttons
    4. wrap dates in a separate component
    5. add icons
    6. wrap status in a separate component
    7. add a separate component for the result
    8. wrap checked status in a span

  -->
  <div class="work-frame">
    <p class="work-frame__name">
      Название работы
    </p>

    <p class="work-frame__deadline">
      Дедлайн <br> сдачи/проверки
    </p>

    <p class="work-frame__status">
      Статус работы
    </p>

    <p class="work-frame__result">
      Результат
    </p>
  </div>
  <div class="work-example">
    <div class="work-example__icon">

    </div> 
    
    <div class="work-example__name">
      <p>
       01.03 ДЗ 2 часть, Биохимия клетки
      </p>

    </div> 

    <div class="work-example__deadline">
      <p>
        03.03 <br> 05.03
      </p>
    </div>

    <div class="work-example__status">
      <p>
        <span class="text-deadline__one">Сдано в дедлайн</span> <br> Проверено
      </p>

    </div>  

    <div class="work-example__result">
      <p>
        13/20
      </p>

    </div> 

    <div class="work-example__button">
      <button class="work-example-button">
        Просмотреть 
      </button>
    </div>
    
  </div>
  
  <div class="work-example">
    <div class="work-example__icon">

    </div> 
    
    <div class="work-example__name">
      <p>
       05.03 ДЗ 2 часть, 2 прохождение: подкласс Круглоротые, класс Рыбы, Земноводные и Пресмыкающиеся
      </p>

    </div> 

    <div class="work-example__deadline">
      <p>
        07.03 <br> 09.03
      </p>
    </div>

    <div class="work-example__status">
      <p>
        <span class="text-deadline__two">Сдано не в дедлайн</span> <br> Не проверено
      </p>
    </div>  

    <div class="work-example__result">
      <p>
        -
      </p>

    </div> 

    <div class="work-example__button">
      <button class="work-example-button">
        Просмотреть 
      </button>
    </div>
  </div>
  <div class="work-example">
    <div class="work-example__icon">

    </div> 
    
    <div class="work-example__name">
      <p>
       07.03 Тест по циклам растений, 200 вопросов
      </p>

    </div> 

    <div class="work-example__deadline">
      <p>
        09.03 <br> 11.03
      </p>
    </div>

    <div class="work-example__status">
      <p>
        <span class="text-deadline__three">Не сдано</span> <br> Не проверено
      </p>
    </div>  

    <div class="work-example__result">
      <p>
        -
      </p>

    </div> 

    <div class="work-example__button">
      <button class="work-example-button">
        Перейти 
      </button>
    </div>
  </div>

  <div class="work-example">
    <div class="work-example__icon">

    </div> 
    
    <div class="work-example__name">
      <p>
       07.03 Тест по циклам растений, 200 вопросов
      </p>

    </div> 

    <div class="work-example__deadline">
      <p>
        09.03 <br> 11.03
      </p>
    </div>

    <div class="work-example__status">
      <p>
        <span class="text-deadline__three">Не сдано</span> <br> Не проверено
      </p>
    </div>  

    <div class="work-example__result">
      <p>
        -
      </p>

    </div> 

    <div class="work-example__button-container">
      <button class="work-example__button-container__button">
        Перейти 
      </button>
    </div>
  </div>

  <div class="work-example">
    <div class="work-example__icon">

    </div> 
    
    <div class="work-example__name">
      <p>
       07.03 Тест по циклам растений, 200 вопросов
      </p>

    </div> 

    <div class="work-example__deadline">
      <p>
        09.03 <br> 11.03
      </p>
    </div>

    <div class="work-example__status">
      <p>
        <span class="text-deadline__three">Не сдано</span> <br> Не проверено
      </p>
    </div>  

    <div class="work-example__result">
      <p>
        -
      </p>

    </div> 

    <div class="work-example__button">
      <button class="work-example-button">
        Перейти 
      </button>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="sass">
.work-frame
  padding-left: 3.5rem
  font-size: 16.2px
  color: var(--text-light)
  margin-bottom: -0.5rem  

  &__name
    display: inline-flex
    justify-content: top
    align-items: top
    width: 42%

  &__deadline
    display: inline-flex
    justify-content: top
    align-items: top
    width: 17%

  &__status
    display: inline-flex
    justify-content: top
    align-items: top
    width: 18.7% 
  
  &__result
    display: inline-flex
    justify-content: top
    align-items: top
    width: 17.3% 

.work-example
  border: 0.08em solid var(--border-radius-color)
  border-radius: var(--border-radius)
  transition: 0.15s ease all
  position: relative //fixed problem with the button
  font-size: 17px

  &__icon
    display: inline-flex
    justify-content: top
    align-items: top
    width: 5%
    
    

  &__name    
    display: inline-flex
    justify-content: top
    align-items: top
    width: 40%
    padding-right: 1rem
    font-weight: 500

  &__deadline
    display: inline-flex
    justify-content: top
    align-items: top
    width: 16%
    

  &__status
    display: inline-flex
    justify-content: top
    align-items: top
    width: 18%
    padding-right: 1rem
    
    
  
  &__result
    display: inline-flex
    justify-content: top
    align-items: top
    width: 8.5%
    

  &__button
    display: inline-flex
    justify-content: center
    align-items: center
    position: absolute //fixed problem with the button
    height: 100% 
    width: 12.5%
    
  

  &-button 
    font-family:'Montserrat', sans-serif 
    font-size: 15px
    border: none
    background-color: var(--primary)
    border-radius: 900px
    padding: 0.6rem
    cursor: pointer
  
  &-button:hover
    font-weight: 500
    border: 1.28px solid rgba(0,0,0, 0.5)
    

.work-example:hover
  border-width: 1.9px

.text-deadline
  
  &__one
    color: var(--text-deadline-color-one)
    margin-bottom:0

  &__two
    color: var(--danger)
    margin-bottom:0

  &__three
    color: var(--warning)
    margin-bottom:0

</style>