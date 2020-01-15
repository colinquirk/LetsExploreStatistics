library(shiny)
library(tidyverse)

theme_set(theme_minimal())

function(input, output) {
  frogs = reactiveVal(rep(0, 1000))

  observeEvent(input$reset, {
    frogs(rep(0, 1000))
  })

  observeEvent(input$continue, {
    steps = rbinom(1000, 1, 0.5)
    steps[steps == 0] = -1
    frogs(frogs() + steps)
  })

  output$frog_plot = renderPlot({
    dat = data.frame(i = 1:1000, frogs = frogs())
    ggplot(dat, aes(x = frogs, y = i)) +
      geom_point(color = 'forestgreen') +
      coord_cartesian(xlim = c(-15, 15)) +
      ylab('') +
      xlab('Hops') +
      theme(panel.grid = element_blank(),
            axis.text.y = element_blank())
  })

  output$dist_plot = renderPlot({
    dat = data.frame(frogs = frogs())
    ggplot(dat, aes(x = frogs)) +
      geom_histogram(bins = 50, fill='forestgreen', binwidth=1) +
      coord_cartesian(xlim = c(-15, 15)) +
      ylab('') +
      xlab('Hops') +
      theme(axis.text.y = element_blank())
  })

  output$qq_plot = renderPlot({
    dat = data.frame(frogs = frogs())
    ggplot(dat, aes(sample = frogs)) +
      stat_qq() +
      stat_qq_line()
  })
}
