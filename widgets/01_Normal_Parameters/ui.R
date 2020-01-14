library(shiny)

pageWithSidebar(
  headerPanel("Normal Distribution Parameters"),
  sidebarPanel(
    sliderInput("mean", "μ", value = 0, min = -10, max = 10),
    sliderInput("sd", "σ", value = 1, min = 0.5, max = 5, step = 0.5)
  ),
  mainPanel(plotOutput("normal_plot"))
)
