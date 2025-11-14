// 从 localStorage 获取数据
function loadData() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const salesData = JSON.parse(localStorage.getItem('salesData')) || [];

    // 加载商品数据
    const productTableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    productTableBody.innerHTML = '';
    products.forEach((product, index) => {
        const row = productTableBody.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${product.name}" id="editProductName${index}"></td>
            <td><input type="number" value="${product.stock}" id="editProductStock${index}"></td>
            <td><input type="number" value="${product.price}" id="editProductPrice${index}"></td>
            <td><input type="number" value="${product.memberPrice}" id="editMemberPrice${index}"></td>
            <td>
                <button class="btn" onclick="saveProduct(${index})">保存</button>
                <button class="btn" onclick="deleteProduct(${index})">删除</button>
            </td>
        `;
    });

    // 加载会员数据
    const memberTableBody = document.getElementById('memberTable').getElementsByTagName('tbody')[0];
    memberTableBody.innerHTML = '';
    members.forEach((member, index) => {
        const row = memberTableBody.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${member.name}" id="editMemberName${index}"></td>
            <td><input type="text" value="${member.phone}" id="editMemberPhone${index}"></td>
            <td><input type="number" value="${member.balance}" id="editMemberBalance${index}"></td>
            <td>
                <button class="btn" onclick="saveMember(${index})">保存</button>
                <button class="btn" onclick="deleteMember(${index})">删除</button>
            </td>
        `;
    });

    // 更新销售额统计
    const totalSalesAmount = salesData.reduce((acc, sale) => acc + sale.amount, 0);
    document.getElementById('totalSalesAmount').textContent = `¥${totalSalesAmount.toFixed(2)}`;

    // 显示商品销售额
    const productSalesAmountElement = document.getElementById('productSalesAmount');
    productSalesAmountElement.innerHTML = '';
    products.forEach(product => {
        const salesAmount = salesData.filter(sale => sale.product === product.name).reduce((acc, sale) => acc + sale.amount, 0);
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name}: ¥${salesAmount.toFixed(2)}`;
        productSalesAmountElement.appendChild(listItem);
    });

    // 更新选择器
    updateSelectors();
}

// 更新商品和会员选择器
function updateSelectors() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const members = JSON.parse(localStorage.getItem('members')) || [];

    const productSelector = document.getElementById('productSelector');
    const memberSelector = document.getElementById('memberSelector');

    productSelector.innerHTML = '<option value="">选择商品</option>';
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = member.name;
        memberSelector.appendChild(option);
    });
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productSelector.appendChild(option);
    });
}

// 添加商品
function addProduct() {
    const name = document.getElementById('productName').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const price = parseFloat(document.getElementById('productPrice').value);
    const memberPrice = parseFloat(document.getElementById('memberPrice').value);

    if (!name || isNaN(stock) || isNaN(price) || isNaN(memberPrice)) {
        alert('请输入完整信息');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ name, stock, price, memberPrice });
    localStorage.setItem('products', JSON.stringify(products));
    loadData();
}

// 编辑商品并保存
function saveProduct(index) {
    const name = document.getElementById(`editProductName${index}`).value;
    const stock = parseInt(document.getElementById(`editProductStock${index}`).value);
    const price = parseFloat(document.getElementById(`editProductPrice${index}`).value);
    const memberPrice = parseFloat(document.getElementById(`editMemberPrice${index}`).value);

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products[index] = { name, stock, price, memberPrice };
    localStorage.setItem('products', JSON.stringify(products));
    loadData();
}

// 删除商品
function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    loadData();
}

// 添加会员
function addMember() {
    const name = document.getElementById('memberName').value;
    const phone = document.getElementById('memberPhone').value;
    const balance = parseFloat(document.getElementById('memberBalance').value);

    if (!name || !phone || isNaN(balance)) {
        alert('请输入完整信息');
        return;
    }

    const members = JSON.parse(localStorage.getItem('members')) || [];
    members.push({ name, phone, balance });
    localStorage.setItem('members', JSON.stringify(members));
    loadData();
}

// 编辑会员并保存
function saveMember(index) {
    const name = document.getElementById(`editMemberName${index}`).value;
    const phone = document.getElementById(`editMemberPhone${index}`).value;
    const balance = parseFloat(document.getElementById(`editMemberBalance${index}`).value);

    const members = JSON.parse(localStorage.getItem('members')) || [];
    members[index] = { name, phone, balance };
    localStorage.setItem('members', JSON.stringify(members));
    loadData();
}

// 删除会员
function deleteMember(index) {
    const members = JSON.parse(localStorage.getItem('members')) || [];
    members.splice(index, 1);
    localStorage.setItem('members', JSON.stringify(members));
    loadData();
}

// 销售功能
function processSale(type) {
    const productName = document.getElementById('productSelector').value;
    const memberName = document.getElementById('memberSelector').value;
    const customPrice = parseFloat(document.getElementById('salePrice').value);
    const quantity = parseInt(document.getElementById('saleQuantity').value);

    if (!productName || quantity < 1) {
        alert('请选择商品和正确的销售数量');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const salesData = JSON.parse(localStorage.getItem('salesData')) || [];

    const product = products.find(p => p.name === productName);
    if (product.stock < quantity) {
        alert('库存不足');
        return;
    }

    let salePrice = customPrice || (type === 'member' ? product.memberPrice : product.price);

    if (type === 'member' && !memberName) {
        alert('请选择会员');
        return;
    }

    if (type === 'member') {
        const member = members.find(m => m.name === memberName);
        if (member.balance < salePrice * quantity) {
            alert('会员余额不足');
            return;
        }
        member.balance -= salePrice * quantity;
        localStorage.setItem('members', JSON.stringify(members));
    }

    product.stock -= quantity;
    salesData.push({ product: productName, amount: salePrice * quantity });
    localStorage.setItem('salesData', JSON.stringify(salesData));
    localStorage.setItem('products', JSON.stringify(products));

    loadData();
}

// 切换销售额统计显示
function toggleSalesAmount() {
    const salesAmountSection = document.getElementById('salesAmountSection');
    const productSalesAmountSection = document.getElementById('productSalesAmount');
    salesAmountSection.classList.toggle('hide');
    productSalesAmountSection.classList.toggle('hide');
}

// 初始化数据
loadData();
