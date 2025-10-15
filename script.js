document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.querySelector('#mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-nav img');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const sizeButtons = document.querySelectorAll('.size-button');
    const selectedOptionsSpan = document.querySelector('.selected-options');
    const addToCartButton = document.querySelector('.add-to-cart');

    const cartFloatingButton = document.getElementById('openCart');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartContent = document.querySelector('.cart-content');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');

    const sizeChartModal = document.getElementById('sizeChartModal');
    const openSizeChartButton = document.getElementById('openSizeChart');
    const compareModal = document.getElementById('compareModal');
    const openCompareModalButton = document.getElementById('openCompareModal');
    const bundleCheckboxes = document.querySelectorAll('.bundle-checkbox');
    const bundleTotalPrice = document.getElementById('bundle-total-price');
    
    // Tab Elements
    const tabButtons = document.querySelectorAll('.tab-button');

    // State Variables
    let selectedColor = 'Teal'; 
    let selectedSize = '-';
    let cartItems = []; 
    let comparedColors = []; 
    // Utility Functions
    function updateSelectedOptions() {
        selectedOptionsSpan.textContent = `Selected: Colour: ${selectedColor} • Size: ${selectedSize}`;
    }
    function updateCartCountDisplay() {
        const count = cartItems.length;
        document.getElementById('cart-count').textContent = count;
        document.getElementById('drawer-cart-count').textContent = count;
    }
    function calculateSubtotal() {
        return cartItems.reduce((total, item) => total + item.price, 0);
    }
    // --- Dynamic Cart Rendering
function renderCart() {
    const subtotal = calculateSubtotal();
    cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)}`;

    if (cartItems.length === 0) {
        cartContent.innerHTML = '<p id="cart-placeholder">Your cart is empty.</p>';
    } else {
        cartContent.innerHTML = cartItems.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <img src="${item.img || '/assests/img1.png'}" alt="${item.name}" style="width: 65px; height: 80px; object-fit: cover; border-radius: 4px;">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-options">Color: ${item.color} • Size: ${item.size}</p>
                </div>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <button class="cart-item-remove" data-index="${index}" title="Remove from cart">&times;</button>
            </div>
        `).join('');

        // --- Add this block for remove functionality 
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.index, 10);
                cartItems.splice(idx, 1); 
                renderCart(); 
            });
        });
    }
    updateCartCountDisplay();
}
    const allModalsAndDrawers = [sizeChartModal, compareModal, cartDrawer];

    function closeModalOrDrawer(element) {
        if (element) {
            element.classList.add('hidden');
            element.classList.remove('visible');
            if (element === cartDrawer) {
                cartOverlay.classList.add('hidden');
                cartOverlay.classList.remove('visible');
            }
        }
    }
    function togglePopup(element, show) {
        if (show) {
            element.classList.add('visible');
            element.classList.remove('hidden');
            if (element === cartDrawer) {
                cartOverlay.classList.add('visible');
                cartOverlay.classList.remove('hidden');
            }
        } else {
            closeModalOrDrawer(element);
        }
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const visibleElement = allModalsAndDrawers.find(el => el && el.classList.contains('visible'));
            closeModalOrDrawer(visibleElement);
        }
    });
    document.querySelectorAll('.close-modal, .close-drawer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.closest('.modal') || btn.closest('.cart-drawer');
            closeModalOrDrawer(target);
        });
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModalOrDrawer(modal);
            }
        });
    });
    cartOverlay.addEventListener('click', () => closeModalOrDrawer(cartDrawer));
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            mainImage.src = thumbnail.src;
        });
    });

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            const newColor = swatch.dataset.color;
            selectedColor = newColor.charAt(0).toUpperCase() + newColor.slice(1);
            updateSelectedOptions();

            const newImageSrc = swatch.dataset.img;
            mainImage.src = newImageSrc; 

            thumbnails.forEach(t => t.classList.remove('active'));
            const matchingThumbnail = Array.from(thumbnails).find(t => t.src === newImageSrc);
            if (matchingThumbnail) {
                matchingThumbnail.classList.add('active');
            }
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            selectedSize = button.dataset.size;
            updateSelectedOptions();
        });
    });


    // --- 2. Size Chart Modal ---
    openSizeChartButton.addEventListener('click', () => togglePopup(sizeChartModal, true));

    // --- 3. Product Info Tabs ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // --- 4. Compare Colours Modal---
    const comparisonDisplay = document.getElementById('comparisonDisplay');
    
    // function renderCompareSwatches() {
    //     const swatchList = document.querySelector('.compare-swatch-list');
    //     swatchList.innerHTML = '';
        
    //     colorSwatches.forEach(swatch => {
    //         const color = swatch.dataset.color;
    //         const img = swatch.dataset.img;
    //         const isSelected = comparedColors.includes(color);

    //         const swatchHtml = document.createElement('div');
    //         swatchHtml.classList.add('compare-swatch-item');
    //         if (isSelected) swatchHtml.classList.add('selected');
    //         swatchHtml.dataset.color = color;
    //         swatchHtml.dataset.img = img;
    //         swatchHtml.innerHTML = `
    //             <div class="color-preview" style="background-color: ${swatch.style.backgroundColor};"></div>
    //             <span>${color.charAt(0).toUpperCase() + color.slice(1)}</span>
    //         `;
            
    //         swatchHtml.addEventListener('click', () => {
    //             if (comparedColors.includes(color)) {
    //                 comparedColors = comparedColors.filter(c => c !== color);
    //             } else if (comparedColors.length < 2) {
    //                 comparedColors.push(color);
    //             } else {
    //                 comparedColors.shift(); // Remove the oldest
    //                 comparedColors.push(color); // Add the new one
    //             }
                
    //             renderCompareSwatches(); 
    //             renderComparisonDisplay();
    //         });

    //         swatchList.appendChild(swatchHtml);
    //     });
    // }
    // ...existing code...

function renderCompareSwatches() {
    const swatchList = document.querySelector('.compare-swatch-list');
    swatchList.innerHTML = '';
    const colorMap = {
        teal:      '#008080',
        navy:      '#000080',
        beige:     '#F5F5DC',
        rust:      '#B7410E',
        'dark-pink': '#80007a'
    };

    colorSwatches.forEach(swatch => {
        const color = swatch.dataset.color;
        const img = swatch.dataset.img;
        const isSelected = comparedColors.includes(color);

        const swatchHtml = document.createElement('div');
        swatchHtml.classList.add('compare-swatch-item');
        if (isSelected) swatchHtml.classList.add('selected');
        swatchHtml.dataset.color = color;
        swatchHtml.dataset.img = img;

        swatchHtml.innerHTML = `
            <div class="color-preview" style="background-color: ${colorMap[color]};"></div>
            <span>${color.charAt(0).toUpperCase() + color.slice(1).replace('-', ' ')}</span>
        `;

        swatchHtml.addEventListener('click', () => {
            if (comparedColors.includes(color)) {
                comparedColors = comparedColors.filter(c => c !== color);
            } else if (comparedColors.length < 2) {
                comparedColors.push(color);
            } else {
                comparedColors.shift(); 
                comparedColors.push(color);
            }

            renderCompareSwatches();
            renderComparisonDisplay();
        });

        swatchList.appendChild(swatchHtml);
    });
}

    function renderComparisonDisplay() {
        comparisonDisplay.innerHTML = '';
        
        if (comparedColors.length === 0) {
            comparisonDisplay.innerHTML = '<p class="placeholder-text">Select two colours above to compare them side-by-side.</p>';
            return;
        }

        comparedColors.forEach(color => {
            // Find the image source from the original swatches
            const swatch = Array.from(colorSwatches).find(s => s.dataset.color === color.toLowerCase());
            if (swatch) {
                const img = swatch.dataset.img;
                comparisonDisplay.innerHTML += `
                    <div class="compare-product-image">
                        <img src="${img}" alt="${color} sweater">
                        <p><strong>${color.charAt(0).toUpperCase() + color.slice(1)}</strong></p>
                    </div>
                `;
            }
        });
    }

    openCompareModalButton.addEventListener('click', () => {
        renderCompareSwatches();
        renderComparisonDisplay();
        togglePopup(compareModal, true);
    });

    // --- 5. Bundle Logic
    function updateBundleTotal() {
        let total = 0;
        bundleCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseFloat(checkbox.dataset.price);
            }
        });
        bundleTotalPrice.textContent = `$${total.toFixed(2)}`;
    }

    bundleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBundleTotal);
    });
    
    document.querySelector('.add-bundle-to-cart').addEventListener('click', () => {
        const bundlePrice = parseFloat(bundleTotalPrice.textContent.replace('$', ''));

        if (bundlePrice > 0) {
            const bundleItem = {
                name: "Global Trend Sweater + Scarf Bundle",
                color: "Mixed",
                size: "N/A", 
                price: bundlePrice,
                img: '/assests/img1.png'
            };
            cartItems.push(bundleItem);
            renderCart();
            togglePopup(cartDrawer, true);
        } else {
            alert('Please select at least one item for the bundle.');
        }
    });


    // --- 6. "ADD TO CART" Logic
    addToCartButton.addEventListener('click', () => {
        if (selectedSize === '-') {
            alert('Please select a size before adding to cart.');
            return;
        }
        const priceText = document.querySelector('.product-price').textContent;
        const priceValueMatch = priceText.match(/(\d+\.\d{2})/); 
        const productPrice = priceValueMatch ? parseFloat(priceValueMatch[0]) : 79.00;
        
        const selectedSwatch = Array.from(colorSwatches).find(s => s.dataset.color.toUpperCase() === selectedColor.toUpperCase());
        const productImage = selectedSwatch ? selectedSwatch.dataset.img : '/assests/img1.png';

        const product = {
            name: "Global Trend Sweater",
            color: selectedColor,
            size: selectedSize,
            price: productPrice,
            img: productImage
        };
        
        cartItems.push(product);
        renderCart(); 
        togglePopup(cartDrawer, true); 
    });

    cartFloatingButton.addEventListener('click', () => togglePopup(cartDrawer, true));

    updateSelectedOptions();
    updateBundleTotal();
    renderCart(); 
});

