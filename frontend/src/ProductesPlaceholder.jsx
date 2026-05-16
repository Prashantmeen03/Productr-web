import "./AddProduct.css";
import { FiSearch, FiHome, FiBox, FiChevronDown, FiX } from "react-icons/fi";

export default function AddProduct() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          Productr
        </div>

        <div className="sidebar-search">
          <FiSearch />
          <input type="text" placeholder="Search" />
        </div>

        <nav className="menu">
          <a href="#">
            <FiHome />
            Home
          </a>

          <a href="#" className="active">
            <FiBox />
            Products
          </a>
        </nav>

      </aside>

      {/* MAIN */}

      <div className="main">

        {/* TOPBAR */}

        <header className="topbar">

          <div className="top-left">
            <FiBox />
            <span>Products</span>
          </div>

          <div className="top-right">

            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search Services, Products"
              />
            </div>

            <div className="profile">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
              />
              <FiChevronDown />
            </div>

          </div>

        </header>

        {/* OVERLAY */}

        <div className="overlay">

          {/* MODAL */}

          <div className="modal">

            <div className="modal-header">
              <h2>Add Product</h2>
              <button>
                <FiX />
              </button>
            </div>

            <div className="modal-body">

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value="CakeZone Walnut Brownie"
                />
              </div>

              <div className="form-group">
                <label>Product Type</label>

                <div className="select-box">
                  <select>
                    <option>Select product type</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="form-group">
                <label>Quantity Stock</label>
                <input
                  type="text"
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>MRP</label>
                <input
                  type="text"
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="text"
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>Upload Product Images</label>

                <div className="upload-box">
                  <p>Enter Description</p>
                  <span>Browse</span>
                </div>
              </div>

              <div className="form-group">
                <label>Exchange or return eligibility</label>

                <div className="select-box">
                  <select>
                    <option>Yes</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button className="create-btn">
                Create
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}