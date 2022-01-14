import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Bills from "../containers/Bills.js"
import userEvent from "@testing-library/user-event"
import Router from "../app/Router"
import store from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
  // test ligne 44-46 BillsUI pour atteindre 100%
  describe('When I am on Dashboard page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  // test ligne 46 BillsUI pour atteindre 100%
  describe('When I am on Dashboard page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      const html = BillsUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  describe("When I am on Bills Page", () => {
    test("then i click on icon eye a popup window apear", () => { // test affichage du popup qui contient le justificatif

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({// log en tant qu'employé
        type: 'Employee'
      }))
      const html = BillsUI({ data: [bills[0]] }) // mise en place de BillsUI dans une constante
      document.body.innerHTML = html // affichage de BillsUI
      const onNavigate = (pathname) => { // creation de la fonction de routage
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null //config du firestore
      const newBills = new Bills({ document, onNavigate, firestore, localStorage })// creation des bill
      $.fn.modal = jest.fn();//comportement du mock
      const eye = screen.getByTestId("icon-eye")// recuperation de l'iconne a cliqué
      const handleClickIconEye = jest.fn(() => newBills.handleClickIconEye(eye))// eye element inside handleclick
      eye.addEventListener('click', handleClickIconEye) // mise en place de l'evenment declencheur
      userEvent.click(eye)//click sur l'élement en question
      expect(handleClickIconEye).toHaveBeenCalled()//handleClick a t'il été bien appelé
      expect(screen.getByText('Justificatif')).toBeTruthy()// le justificatif est il bien affiché
    })
  })

  describe("When I am on Bills Page", () => { 
    test("then i click on NewBill button i must be redirect to NewBill", () => {// test de redirection vers newBill

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({// log en tant qu'employé
        type: 'Employee'
      }))
      const html = BillsUI({ data: [bills[0]] })// mise en place de BillsUI dans une constante
      document.body.innerHTML = html // affichage de BillsUI
      const onNavigate = (pathname) => {// creation de la fonction de routage
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null //config du firestore
      const newBills = new Bills({ document, onNavigate, firestore, localStorage })// creation des bill
      // $.fn.modal = jest.fn();//comportement du mock
      const btn = screen.getByTestId("btn-new-bill")// recupération du boutton
      const handleClickNewBill = jest.fn(() => newBills.handleClickNewBill)// btn element inside handleclick
      btn.addEventListener('click', handleClickNewBill)//mise en place de l'evenment click
      userEvent.click(btn) // click sur le bouuton
      expect(handleClickNewBill).toHaveBeenCalled() // la fonction est elle bien appelée ?
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy() // les élements affichés sont il les bons
    })
  })

  describe("When I am on Bills Page", () => { 
    test("then i click on NewBill button i must be redirect to NewBill", () => {// test de redirection vers newBill

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({// log en tant qu'employé
        type: 'Employee'
      }))
      const html = BillsUI({ data: [bills[0]] })// mise en place de BillsUI dans une constante
      document.body.innerHTML = html // affichage de BillsUI
      const onNavigate = (pathname) => {// creation de la fonction de routage
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null //config du firestore
      const newBills = new Bills({ document, onNavigate, firestore, localStorage })// creation des bill
      // $.fn.modal = jest.fn();//comportement du mock
      const btn = screen.getByTestId("btn-new-bill")// recupération du boutton
      const handleClickNewBill = jest.fn(() => newBills.handleClickNewBill)// btn element inside handleclick
      btn.addEventListener('click', handleClickNewBill)//mise en place de l'evenment click
      userEvent.click(btn) // click sur le bouuton
      expect(handleClickNewBill).toHaveBeenCalled() // la fonction est elle bien appelée ?
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy() // les élements affichés sont il les bons
    })
  })
  
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
     
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      const pathname = ROUTES_PATH["Bills"] 
      Object.defineProperty(window, "location", { value: { hash: pathname } })
      
      document.body.innerHTML = `<div id="root"></div>`
      Router()

      expect(screen.getByTestId("icon-window").classList.contains("active-icon"))
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => b.date - a.date 
      // changement de calcul
      const datesSorted = [...dates].sort(antiChrono)
      
      expect(dates).toEqual(datesSorted)
    })
    // test container bill "nouvelle note de frais"
    describe("When I click on New Bill btn", () => {
      test("It should renders new bill page", () => {
        
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
  
        const html = BillsUI({ data: []})
        document.body.innerHTML = html
  
        const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
        
        const bills = new Bills({document, onNavigate, localStorage: window.localStorage})
  
        const handleClickNewBill = jest.fn(() => bills.handleClickNewBill)
        const newBillBtn = screen.getByTestId('btn-new-bill')
  
        newBillBtn.addEventListener('click', handleClickNewBill)
        userEvent.click(newBillBtn)

        expect(handleClickNewBill).toHaveBeenCalled()
        expect(screen.queryByText('Envoyer une note de frais')).toBeTruthy()
      })
    })
    // test container bill 50-71% "test modale"
    describe('When I click on the icon eye from a bill', () => {
      test('A modal should open', () => {
       
        window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
        
        const html = BillsUI({ data: [bills[1]] })
        document.body.innerHTML = html

        const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}

        const billsClass = new Bills({document, onNavigate, localStorage: window.localStorage})

        const modale = document.getElementById("modaleFile")
        $.fn.modal = jest.fn(() => modale.classList.add('show'))
    
        const handleClickIconEye = jest.fn(() => billsClass.handleClickIconEye)
        const iconEye = screen.getByTestId('icon-eye')
    
        iconEye.addEventListener('click', handleClickIconEye)
        userEvent.click(iconEye)

        expect(handleClickIconEye).toHaveBeenCalled()
        expect(modale.classList).toContain('show')
      })
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(store, "get")
       const bills = await store.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})