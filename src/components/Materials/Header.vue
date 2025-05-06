<script></script>
<template>
    <header>
        <NavBar style="position: relative; display: flex; justify-content: center; flex-shrink: 0; gap: 30%;">
            <div style="display: flex; flex-direction: row;">
                <CustomButton size="small" style="background: none;" @click="handleshowCart()">
                    <template #icon>
                        <img src="/static-stuff/panier.svg" alt="panier" width="48">
                    </template>
                </CustomButton>

                <CustomButton v-if="!username" text="Se Connecter" size="small" @click="showLogin = true" />
                <div v-else style="display: flex; flex-direction: row; align-items: center;">
                    <h1 style="color: #fff;">{{ username }}</h1>
                    <CustomButton text="Deconnecter" size="small" @click="logout()" />
                </div>
            </div>
            <span style="display: flex; flex-direction: row; max-width: 400px; gap: 80px;">
                <div v-for="(item, i) in items" :key="i" class="nav-link" :class="{
                    focused: focusedIndex === i,
                    blurred: focusedIndex !== null && focusedIndex !== i
                }" @mouseenter="focusedIndex = i" @mouseleave="focusedIndex = null">
                    <Link :text="item.text" :to="item.href" />
                </div>
            </span>
        </NavBar>
    </header>
</template>