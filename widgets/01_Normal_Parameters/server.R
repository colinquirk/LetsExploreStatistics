library(shiny)

function(input, output) {
  output$normal_plot = renderPlot({
    mean = input$mean
    sd = input$sd

    sx <- seq(-10, 10, length=1000)
    sy <- dnorm(sx, 0, 1)

    x <- seq(-10, 10, length=1000)
    y <- dnorm(x, mean, sd)

    plot(sx, sy, type="l", ylim = c(0, 1), xlim = c(-10, 10), lwd = 5, xlab = '', ylab = '')
    lines(x, y, lwd = 5, col = 'firebrick2')
  })
}
