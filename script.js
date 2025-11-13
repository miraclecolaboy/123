// script.js
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

// ... 这里继续包含其余的 JavaScript 逻辑
