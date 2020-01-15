library(shiny)

fluidPage(
  sidebarPanel(
    actionButton('continue', 'Progress...'),
    actionButton('reset', 'Reset')),
  mainPanel(
    plotOutput("frog_plot"),
    plotOutput("dist_plot"),
    plotOutput("qq_plot")
  )
)
