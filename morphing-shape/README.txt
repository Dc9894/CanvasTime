A Pen created at CodePen.io. You can find this one at https://codepen.io/rachsmith/pen/ONVQWv.

 So I really like the countdown on the Google I/O site https://events.google.com/io2016/?gclid=CPSVq9bjo8sCFU1gfgodjmQE6w - so much so I had a burning desire to figure out how they did that! I did a little snooping in the source and it turns out they're 

- taking SVG paths (the number shapes)
- sampling the path
- drawing this path to canvas (with 4 different stroke colors)
- tween between the different number paths to create the animation

Google's version of the code is a lot more complex, accounting for resizing and complexity of the different paths, but this is just a simplified version of the same technique.

If you would like me to write a blog post further explaining this technique let me know!