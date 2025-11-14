function show(type) {
    const vis = document.getElementById('visualization');
    vis.innerHTML = '';

    const input = prompt(`Enter comma-separated values for ${type}:`, "1,2,3");
    if (!input) return;
    const values = input.split(',').map(v => v.trim());

    switch(type) {
        case 'array':
            animateArray(vis, values);
            break;
        case 'stack':
            animateStack(vis, values);
            break;
        case 'queue':
            animateQueue(vis, values);
            break;
        case 'linkedlist':
            animateLinkedList(vis, values);
            break;
        case 'bst':
            animateBST(vis, values.map(Number));
            break;
    }
}

function createNode(val) {
    const node = document.createElement("div");
    node.className = "node";
    node.textContent = val;
    return node;
}

function animateArray(container, array) {
    array.forEach((num, i) => {
        setTimeout(() => {
            const node = createNode(num);
            container.appendChild(node);
        }, i * 300);
    });
}

function animateStack(container, stack) {
  $('#stack').empty();
  stack.forEach((val, idx) => {
    const $node = $(<div class="node">${val}</div>);
    $('#stack').append($node);
  });
}

  function push() {
    const value = $('#value').val().trim();
    if (value) {
      stack.push(value);
      const $node = $(<div class="node added">${value}</div>);
      $('#stack').prepend($node);
      setTimeout(() => {
        $node.removeClass('added');
      }, 500);
      $('#value').val('');
    }
  }

  function pop() {
    if (stack.length > 0) {
      const removed = stack.pop();
      const $nodes = $('#stack .node');
      if ($nodes.length > 0) {
        const $topNode = $nodes.first();
        $topNode.addClass('deleted');
        setTimeout(() => {
          $topNode.remove();
        }, 300);
      }
    }
  }

function animateQueue(container, queue) {
    queue.forEach((num, i) => {
        setTimeout(() => {
            const node = createNode(num);
            container.appendChild(node);
        }, i * 300);
    });
}

function animateLinkedList(container, list) {
    list.forEach((num, i) => {
        setTimeout(() => {
            const node = createNode(num);
            container.appendChild(node);
            if (i < list.length - 1) {
                const arrow = document.createElement("span");
                arrow.innerHTML = " ➜ ";
                container.appendChild(arrow);
            }
        }, i * 300);
    });
}

function animateBST(container, values) {
    const positions = {
        depth: 0,
        offset: 50,
        gap: 20
    };

    function insertNode(value, depth, leftOffset, rightOffset) {
        const node = createNode(value);
        node.style.position = "absolute";
        node.style.top = `${depth * 80 + 20}px`;
        node.style.left = `${(leftOffset + rightOffset) / 2}%`;
        container.appendChild(node);
    }

    function buildTree(values) {
        if (!values.length) return;

        const rootVal = values.shift();
        insertNode(rootVal, 0, 0, 100);

        const root = { val: rootVal, left: null, right: null };

        values.forEach(val => {
            let current = root;
            let depth = 1;
            let left = 0, right = 100;

            while (true) {
                if (val < current.val) {
                    right = (left + right) / 2;
                    if (!current.left) {
                        insertNode(val, depth, left, right);
                        current.left = { val: val };
                        break;
                    } else {
                        current = current.left;
                    }
                } else {
                    left = (left + right) / 2;
                    if (!current.right) {
                        insertNode(val, depth, left, right);
                        current.right = { val: val };
                        break;
                    } else {
                        current = current.right;
                    }
                }
                depth++;
            }
        });
    }

    buildTree(values);
}
