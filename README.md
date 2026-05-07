# 🖥️ SECOM 2026 — Site Oficial

Site oficial da **Semana de Computação da UESPI** - 2026

---

## 📁 Estrutura de Arquivos

```
/
├── index.html       # Estrutura principal da página
├── static/
│   ├── css/
│   │   └── styles.css   # Estilos mobile-first
│   ├── js/
│   │   └── script.js    # Partículas, contadores e menu
│   └── img/
│       └── secom26logo.webp  # Logo do evento
```

---

## 🎨 Design

- Tema **dark neon** com paleta em azul (`#00d4ff`), laranja (`#ff6b00`) e verde (`#00ff88`)
- Tipografia: **Orbitron** (títulos) + **Inter** (corpo)
- Animações em CSS puro: partículas flutuantes, grid animado, logo flutuante e contadores com scroll

---

## 📱 Responsividade (Mobile First)

| Breakpoint | Comportamento |
|---|---|
| `< 975px` | Menu sanduíche, layout em coluna única |
| `≥ 975px` | Menu completo na navbar, grids de múltiplas colunas |
| `≥ 1024px` | Refinamentos de espaçamento e footer em 4 colunas |

---

## ⚙️ Funcionalidades

- **Partículas animadas** geradas dinamicamente via JavaScript
- **Menu sanduíche** com animação de abertura/fechamento e backdrop blur
- **Contadores animados** nas estatísticas do hero, ativados por scroll (IntersectionObserver)
- **Navbar** com efeito de opacidade ao rolar a página

---

## 🚀 Como usar

Basta abrir o `index.html` em qualquer navegador. Não há dependências externas ou build necessário — apenas as fontes do Google Fonts carregadas via CDN.

```bash
# Exemplo com Live Server (VS Code)
# Clique com botão direito em index.html → "Open with Live Server"
```
## ✏️ Personalização

| O que mudar | Onde |
|---|---|
| Cores principais | Variáveis `:root` no início do `styles.css` |
| Datas e local do evento | Seção `#hero` no `index.html` |
| Palestrantes | Seção `#palestrantes` no `index.html` |
| Links das redes sociais | Seção `<footer>` no `index.html` |
| Logo | Substituir `/static/img/secom26logo.webp` |

---

## 👨‍💻 Créditos

Desenvolvido por [SerejoDev](https://github.com/JosueSerejo) e [Mariana Mota](https://github.com/eumarianamota) para o evento **SECOM** do curso de  **Tecnologia em Sistemas de Computação — UESPI Campus Parnaíba**.

---

&copy; 2026 SECOM — UESPI