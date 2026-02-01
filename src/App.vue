<template>
<nav class="navbar navbar-expand-lg bg-black" data-bs-theme="dark">
  <div class="container-fluid">
    <a style="font-weight: 900;" class="navbar-brand" href="#">Admision</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" data-bs-theme="dark" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" aria-current="page"><router-link style="text-decoration: none; color: aliceblue;" to="/">Home</router-link></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">  <router-link style="text-decoration: none; color: aliceblue; " to="/about">About</router-link></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">  <router-link style="text-decoration: none; color: aliceblue; " to="/buscar">Buscar</router-link></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">  <router-link style="text-decoration: none; color: aliceblue; " to="/reportes/mensual">📊 Reporte Mensual</router-link></a>
        </li>
      </ul>
    </div>
  </div>
</nav>
  <router-view/>
  

</template>

