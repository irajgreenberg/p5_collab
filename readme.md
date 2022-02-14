Collaborative development using P5, TypeScript & Parcel in Node environment

Requires: Node, Download at https://nodejs.org/en/
Project adheres to P5's Instanced mode: https://p5js.org/reference/#/p5/p5

Getting Started:

1. Install Node
2. Clone/fork from: https://github.com/irajgreenberg/p5_collab
3. npm install
4. npm run dev  - to run locally at: localhost:8080, without building
5. npm run build - to generate bundle.js, written to dist directory

Project entry point is set in script tag in index.html (e.g.: <script type="module" src="src/projects/protobyte_p5_001/sketch.ts"></script>)

Projects should live in src/projects directory. Simplest if each project includes a "sketch.ts" file as entry point.

Each collaborator should create a branch using:
git branch [branch name]
Then checkout the branch

Example creating ira branch:
git branch ira
git checkout ira

Basic git:
To update locallly:
git add .
git commit -m "add comment here"  (note: quotes are required)

To push to server:
git push

Note: the first time you push your branch to github, you'll be prompted to --set-upstream. After doing that once, you should be able to just git push
git push --set-upstream origin [branch name]

On Github, you'll need to use the pulldown menu (likely set to main by default) to see your branch.
  

Have fun and make engaging, joyful stuff.



## Credits:
Template from: https://github.com/CaribouJohn/p5-typescript-template
Notes below included from: https://github.com/CaribouJohn/p5-typescript-template readme.md

"Various online sources helped me get to this point, but especially https://github.com/Gaweph/p5-typescript-starter (Thanks!) 

This is mainly for my benefit but if you gain anything from it feel free to use it in any way consistant with the MIT Licence I am inheriting from [here](https://github.com/Gaweph/p5-typescript-starter)." 
